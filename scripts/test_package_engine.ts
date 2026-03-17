import { PackagePricingEngine, PricingItem } from '../src/modules/engine/PackagePricingEngine';
import { TranslationService } from '../src/core/i18n/TranslationService';

async function runPackageTest() {
  // Primer iz Deo 6 dokumentacije: Package = Hotel + Flight + Transfer
  const packageItems: PricingItem[] = [
    {
      type: 'FLIGHT',
      description: 'Beograd → Hurghada (direktan)',
      netPrice: 250,
      taxes: 40,
      fees: 10,
      currency: 'EUR',
      supplierId: 'Amadeus',
    },
    {
      type: 'HOTEL',
      description: 'Hurghada Sol Plaza 5* (7 noći, All Inclusive, 2+2)',
      netPrice: 760,
      taxes: 40,
      fees: 0,
      currency: 'EUR',
      supplierId: 'WebBeds',
      destination: 'EG',
    },
    {
      type: 'TRANSFER',
      description: 'Privatni transfer Aerodrom → Hotel',
      netPrice: 60,
      fees: 5,
      currency: 'EUR',
    }
  ];

  console.log('--- 🧮 PAKET PRICING ENGINE SIMULATOR ---');

  for (const channel of ['B2C', 'B2B'] as const) {
    TranslationService.setLanguage(channel === 'B2C' ? 'sr' : 'en');
    const result = PackagePricingEngine.calculatePackage(packageItems, channel, channel === 'B2C' ? 'SUMMER2026' : undefined);

    console.log(`\n📦 KANAL: ${result.channel}`);
    console.log('─────────────────────────────────────────');

    result.items.forEach(item => {
      console.log(`  ${item.type}: ${result.labels.net} ${item.netPrice} + ${result.labels.markup} ${item.markup} = ${result.labels.sell} ${item.sellPrice} ${item.currency}`);
    });

    console.log(`\n  ${result.labels.total}: ${result.itemsTotal} EUR`);
    if (result.bundleDiscount > 0) console.log(`  Bundle Discount: -${result.bundleDiscount} EUR`);
    if (result.promoDiscount > 0) console.log(`  Promo Discount:  -${result.promoDiscount} EUR`);
    console.log(`  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`  FINAL TOTAL:     ${result.finalTotal} EUR`);
    console.log(`  ${result.labels.savings}: ${result.displaySavings} EUR`);
    console.log(`  ${result.labels.margin}: ${result.totalMargin} EUR (${result.marginPercentage}%)`);
    if (result.badges.length > 0) console.log(`  🏷️  Badges: ${result.badges.join(', ')}`);
  }

  console.log('\n--- ✅ SIMULACIJA ZAVRŠENA ---');
}

runPackageTest();
