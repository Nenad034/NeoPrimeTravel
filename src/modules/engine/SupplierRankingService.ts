import { PackagePricingEngine, PricingItem, PackagePriceBreakdown, Channel } from './PackagePricingEngine';

/**
 * Jedan ponuđač (dobavljač) sa svojim cenama
 */
export interface SupplierOffer {
  supplierId: string;
  supplierName: string;
  items: PricingItem[];  // Hotel + Flight + Transfer - ISTI tip i ISTA usluga
  // Metrici za rangiranje (iz dokumentacije Sekcija 19)
  reliability: number;     // 0-100: stopa potvrde
  responseTimeMs: number;  // Brzina API odgovora
  cancellationRate: number; // 0-1: stopa otkazivanja
}

/**
 * Rezultat za B2C: jedan optimalni rezultat
 */
export interface B2CSearchResult {
  winner: SupplierOffer;
  breakdown: PackagePriceBreakdown;
  score: number;
  hiddenCompetitorCount: number; // "još 4 opcije" - bez detalja
}

/**
 * Rezultat za B2B: sve opcije vidljive agentu
 */
export interface B2BSearchResult {
  viewMode: 'LOWEST_ONLY' | 'ALL_SUPPLIERS';
  results: Array<{
    offer: SupplierOffer;
    breakdown: PackagePriceBreakdown;
    score: number;
    rank: number;
  }>;
  cheapestTotal: number;
  agencyCommission?: number; // Provizija za konkretnu agenciju
}

/**
 * SupplierRankingService
 * 
 * Implementira dokumentovanu logiku iz Sekcije 19 i 23:
 * - B2C: Jedan pobednik (najniža cena + kvalitet + pouzdanost)
 * - B2B: Svi dobavljači vidljivi (sa opcijom filtera)
 * 
 * Veza sa bazom:
 * - B2C čita: contacts.loyalty_tier, contacts.preferences
 * - B2B čita: agencies.commission_rate, agencies.credit_limit, agencies.pricing_model
 */
export class SupplierRankingService {

  /**
   * Iz dokumentacije Sekcija 19.3 - Supplier Score Formula:
   * score = 0.35*margin + 0.25*price + 0.20*reliability + 0.10*speed + 0.10*package_eligibility
   */
  private static calculateSupplierScore(
    offer: SupplierOffer,
    breakdown: PackagePriceBreakdown,
    allBreakdowns: PackagePriceBreakdown[]
  ): number {
    // Margin score (0-100)
    const maxMarginPct = Math.max(...allBreakdowns.map(b => b.marginPercentage));
    const marginScore = maxMarginPct > 0 ? (breakdown.marginPercentage / maxMarginPct) * 100 : 50;

    // Price score - najniža cena dobija 100
    const prices = allBreakdowns.map(b => b.finalTotal);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice || 1;
    const priceScore = 100 - ((breakdown.finalTotal - minPrice) / priceRange) * 100;

    // Reliability score (direktno iz dobavljača)
    const reliabilityScore = offer.reliability;

    // Response time score (manji = bolji)
    const maxRt = Math.max(...[offer].map(o => o.responseTimeMs)) || 1;
    const responseScore = 100 - (offer.responseTimeMs / (maxRt * 1.5)) * 100;

    // Package eligibility (uvek 100 jer su svi prošli filter)
    const packageScore = 100;

    // Weighted formula iz dokumentacije
    const total =
      0.35 * marginScore +
      0.25 * priceScore +
      0.20 * reliabilityScore +
      0.10 * responseScore +
      0.10 * packageScore;

    return Math.round(total * 100) / 100;
  }

  /**
   * B2C pretraga: Vraća JEDAN optimalni rezultat.
   * 
   * Pravilo: Isti tip sobe i ista vrsta usluge (board type) obavezni su za poređenje.
   * Pobednik = najviši composite score.
   * Klijentu se pokazuje samo FINAL PRICE, ne i koji dobavljač.
   */
  public static searchB2C(
    supplierOffers: SupplierOffer[],
    promoCode?: string,
    contactId?: string  // Veza sa contacts tabelom u bazi
  ): B2CSearchResult {
    console.log(`[SupplierRanking/B2C] Poređenje ${supplierOffers.length} dobavljača za klijenta ${contactId || 'anonymous'}...`);

    // 1. Izračunaj cene svakog dobavljača
    const allBreakdowns = supplierOffers.map(o =>
      PackagePricingEngine.calculatePackage(o.items, 'B2C', promoCode)
    );

    // 2. Score svakog dobavljača
    const scored = supplierOffers.map((offer, i) => ({
      offer,
      breakdown: allBreakdowns[i],
      score: this.calculateSupplierScore(offer, allBreakdowns[i], allBreakdowns)
    }));

    // 3. Pobednik = najviši score
    scored.sort((a, b) => b.score - a.score);
    const winner = scored[0];

    return {
      winner: winner.offer,
      breakdown: winner.breakdown,
      score: winner.score,
      hiddenCompetitorCount: scored.length - 1  // B2C ne vidi ko su ostali
    };
  }

  /**
   * B2B pretraga: Vraća sve ili samo najjeftinije.
   * 
   * Agent bira mod:
   * - LOWEST_ONLY: Jedna preporuka (brzo)
   * - ALL_SUPPLIERS: Sve opcije sa detaljima (za iskusnog agenta)
   * 
   * Agencijska provizija se automatski primenjuje na osnovu agencyId iz baze.
   */
  public static searchB2B(
    supplierOffers: SupplierOffer[],
    viewMode: 'LOWEST_ONLY' | 'ALL_SUPPLIERS' = 'ALL_SUPPLIERS',
    agencyId?: string  // Veza sa agencies tabelom u bazi
  ): B2BSearchResult {
    console.log(`[SupplierRanking/B2B] Mod: ${viewMode} | ${supplierOffers.length} dobavljača | Agencija: ${agencyId || 'direktni agent'}...`);

    // 1. Simulacija: Dohvati proviziju agencije iz baze (buduće Prisma query)
    // const agency = await prisma.agency.findUnique({ where: { id: agencyId } });
    const agencyCommissionRate = agencyId ? 0.07 : 0.05; // Mock: 7% ugovoreni agenti, 5% direktni

    // 2. Izračunaj B2B cene
    const allBreakdowns = supplierOffers.map(o =>
      PackagePricingEngine.calculatePackage(o.items, 'B2B')
    );

    // 3. Score i rank
    let ranked = supplierOffers.map((offer, i) => ({
      offer,
      breakdown: allBreakdowns[i],
      score: this.calculateSupplierScore(offer, allBreakdowns[i], allBreakdowns),
      rank: 0
    }));
    ranked.sort((a, b) => b.score - a.score);
    ranked = ranked.map((r, i) => ({ ...r, rank: i + 1 }));

    const cheapestTotal = Math.min(...allBreakdowns.map(b => b.finalTotal));
    const agencyCommission = cheapestTotal * agencyCommissionRate;

    // 4. Filter po modu
    const results = viewMode === 'LOWEST_ONLY'
      ? [ranked.find(r => r.breakdown.finalTotal === cheapestTotal) || ranked[0]]
      : ranked;

    return { viewMode, results, cheapestTotal, agencyCommission };
  }
}
