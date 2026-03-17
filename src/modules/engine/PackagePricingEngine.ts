import { TranslationService } from '../../core/i18n/TranslationService';

export type Channel = 'B2C' | 'B2B' | 'INTERNAL';

export interface PricingItem {
  type: 'HOTEL' | 'FLIGHT' | 'TRANSFER' | 'ACTIVITY' | 'INSURANCE';
  description: string;
  netPrice: number;       // Cena od dobavljača
  taxes?: number;         // Takse (gradski porez, aerodromske takse...)
  fees?: number;          // Operativne naknade
  currency: string;
  supplierId?: string;
  destination?: string;
}

export interface PricedItem extends PricingItem {
  markup: number;         // Layer 3: Commercial
  discount: number;       // Layer 4: Discount
  sellPrice: number;      // Layer 5: Finalni iznos
}

export interface PackagePriceBreakdown {
  channel: Channel;
  currency: string;
  items: PricedItem[];
  itemsTotal: number;
  bundleDiscount: number;     // Paketni popust (Hotel+Flight = -5%)
  promoDiscount: number;      // Promo kod popust
  finalTotal: number;         // Krajnja cena
  totalNet: number;           // Ukupna nabavna cena
  totalMargin: number;        // Zarada agencije
  displaySavings: number;     // Koliko je klijent "uštedeo"
  marginPercentage: number;   // Marža u procentima
  badges: string[];           // Best Value, Family Favorite...
  labels: Record<string, string>;
}

/**
 * PackagePricingEngine
 * 
 * Implementira 5-slojni model cena iz dokumentacije (Deo 6):
 * Layer 1: Base Price  (net od dobavljača)
 * Layer 2: Adjustment  (takse, doplate, operativni troškovi)
 * Layer 3: Commercial  (markup, provizija po kanalu/tipu/dobavljaču)
 * Layer 4: Discount    (promo, bundle, sezonski)
 * Layer 5: Finalization (zaokruživanje, snapshot, marža)
 */
export class PackagePricingEngine {

  // ── KONFIGURISLJIVA PRAVILA (buduće CommercialRule tabela) ──────────────
  private static MARKUP_RULES: Record<string, Record<string, number>> = {
    B2C: { HOTEL: 0.12, FLIGHT: 0.06, TRANSFER: 0.15, ACTIVITY: 0.18, INSURANCE: 0.20 },
    B2B: { HOTEL: 0.07, FLIGHT: 0.03, TRANSFER: 0.10, ACTIVITY: 0.12, INSURANCE: 0.15 },
    INTERNAL: { HOTEL: 0, FLIGHT: 0, TRANSFER: 0, ACTIVITY: 0, INSURANCE: 0 }
  };

  private static BUNDLE_DISCOUNTS: { required: string[]; percent: number }[] = [
    { required: ['HOTEL', 'FLIGHT'], percent: 0.05 },
    { required: ['HOTEL', 'FLIGHT', 'TRANSFER'], percent: 0.08 },
    { required: ['HOTEL', 'ACTIVITY'], percent: 0.03 },
  ];

  // ── JAVNI API ─────────────────────────────────────────────────────────────

  /**
   * Glavna metoda: Prima listu sirovnih stavki, vraća potpuni Price Breakdown.
   */
  public static calculatePackage(
    items: PricingItem[],
    channel: Channel = 'B2C',
    promoCode?: string
  ): PackagePriceBreakdown {
    console.log(`[PackagePricingEngine] Računam paket za kanal ${channel} sa ${items.length} stavki...`);

    // Layer 1 + 2 + 3 + 4: Cena po stavci
    const pricedItems: PricedItem[] = items.map(item => this.priceItem(item, channel));

    // Layer 4: Bundle Discount
    const itemTypes = items.map(i => i.type);
    const bundleDiscountPercent = this.getBundleDiscountPercent(itemTypes);
    const itemsTotal = pricedItems.reduce((sum, i) => sum + i.sellPrice, 0);
    const bundleDiscount = Math.round(itemsTotal * bundleDiscountPercent * 100) / 100;

    // Layer 4: Promo Discount
    const promoDiscount = promoCode ? this.applyPromoCode(promoCode, itemsTotal) : 0;

    // Layer 5: Finalization
    // Pravi net = samo nabavna cena + takse + fees (pre markup-a)
    const totalNet = pricedItems.reduce((sum, i) => sum + i.netPrice + (i.taxes || 0) + (i.fees || 0), 0);
    const totalMarkup = pricedItems.reduce((sum, i) => sum + i.markup, 0);
    
    // Guard: Bundle popust ne sme da premaši ukupan markup (nema negativne marže)
    const maxAllowedDiscount = Math.max(0, totalMarkup - totalNet * 0.02); // min 2% marže
    const effectiveBundleDiscount = Math.min(bundleDiscount, maxAllowedDiscount);
    const effectivePromoDiscount  = Math.min(promoDiscount, Math.max(0, maxAllowedDiscount - effectiveBundleDiscount));

    const finalTotal = Math.round((itemsTotal - effectiveBundleDiscount - effectivePromoDiscount) * 100) / 100;
    // Marža = ukupan markup - primenjeni popusti
    const totalMargin = Math.round((totalMarkup - effectiveBundleDiscount - effectivePromoDiscount) * 100) / 100;
    const marginPercentage = finalTotal > 0 ? Math.round((totalMargin / finalTotal) * 10000) / 100 : 0;
    const displaySavings = Math.round((effectiveBundleDiscount + effectivePromoDiscount) * 100) / 100;

    // Badge Engine
    const badges = this.assignBadges(marginPercentage, bundleDiscountPercent, channel);

    return {
      channel,
      currency: items[0]?.currency || 'EUR',
      items: pricedItems,
      itemsTotal,
      bundleDiscount: effectiveBundleDiscount,
      promoDiscount: effectivePromoDiscount,
      finalTotal,
      totalNet,
      totalMargin,
      displaySavings,
      marginPercentage,
      badges,
      labels: this.buildLabels()
    };
  }

  // ── PRIVATNE METODE ───────────────────────────────────────────────────────

  /** Layer 1–3: Cena jedne stavke */
  private static priceItem(item: PricingItem, channel: Channel): PricedItem {
    const taxes = item.taxes || 0;
    const fees = item.fees || 0;
    const baseWithAdjustments = item.netPrice + taxes + fees; // Layer 1 + 2

    // Layer 3: Markup po kanalu i tipu
    const markupRate = this.MARKUP_RULES[channel]?.[item.type] || 0.10;
    const markup = Math.round(baseWithAdjustments * markupRate * 100) / 100;

    const sellPrice = Math.round((baseWithAdjustments + markup) * 100) / 100;

    return { ...item, taxes, fees, markup, discount: 0, sellPrice };
  }

  /** Nalazi best matching bundle pravilo */
  private static getBundleDiscountPercent(itemTypes: string[]): number {
    let bestDiscount = 0;
    for (const rule of this.BUNDLE_DISCOUNTS) {
      if (rule.required.every(r => itemTypes.includes(r))) {
        if (rule.percent > bestDiscount) bestDiscount = rule.percent;
      }
    }
    return bestDiscount;
  }

  /** Simulacija promo koda */
  private static applyPromoCode(code: string, total: number): number {
    const PROMO_CODES: Record<string, number> = {
      'SUMMER2026': 50,
      'FIRST10': total * 0.10,
      'VIP200': 200
    };
    return PROMO_CODES[code.toUpperCase()] || 0;
  }

  /** Badge Engine - dodeljuje oznake paketu */
  private static assignBadges(marginPct: number, bundleDiscount: number, channel: Channel): string[] {
    const badges: string[] = [];
    if (bundleDiscount > 0) badges.push('Best Value');
    if (marginPct > 20) badges.push('Recommended');
    if (channel === 'B2C' && bundleDiscount >= 0.08) badges.push('Top Seller');
    return badges;
  }

  /** Lokalizovane labele za izveštaje */
  private static buildLabels(): Record<string, string> {
    const lang = TranslationService.getLanguage();
    return lang === 'sr'
      ? { net: 'Nabavna cena', markup: 'Marža', sell: 'Prodajna cena', total: 'Ukupno', savings: 'Uštedeli ste', margin: 'Zarada' }
      : { net: 'Net Price', markup: 'Markup', sell: 'Sell Price', total: 'Total', savings: 'You Saved', margin: 'Margin' };
  }
}
