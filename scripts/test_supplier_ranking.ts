import { SupplierRankingService, SupplierOffer } from '../src/modules/engine/SupplierRankingService';

// Simuliramo isti hotel (Sol Plaza 5*, All Inclusive) od 3 različita dobavljača
// Pravilo: ISTI tip sobe (DBL) i ISTA usluga (AI) - jedino tada je poređenje fer
const supplierOffers: SupplierOffer[] = [
  {
    supplierId: 'WEBBEDS',
    supplierName: 'WebBeds',
    reliability: 95,
    responseTimeMs: 320,
    cancellationRate: 0.03,
    items: [
      { type: 'FLIGHT',   description: 'BEG→HRG (direktan)', netPrice: 255, taxes: 40, fees: 10, currency: 'EUR' },
      { type: 'HOTEL',    description: 'Sol Plaza 5* | DBL | AI | 7 noći', netPrice: 760, taxes: 40, currency: 'EUR', destination: 'EG' },
      { type: 'TRANSFER', description: 'Privatni transfer', netPrice: 60, fees: 5, currency: 'EUR' },
    ]
  },
  {
    supplierId: 'EXPEDIA',
    supplierName: 'Expedia Partner',
    reliability: 88,
    responseTimeMs: 890,
    cancellationRate: 0.07,
    items: [
      { type: 'FLIGHT',   description: 'BEG→HRG (direktan)', netPrice: 248, taxes: 40, fees: 15, currency: 'EUR' },
      { type: 'HOTEL',    description: 'Sol Plaza 5* | DBL | AI | 7 noći', netPrice: 780, taxes: 40, currency: 'EUR', destination: 'EG' },
      { type: 'TRANSFER', description: 'Privatni transfer', netPrice: 65, fees: 5, currency: 'EUR' },
    ]
  },
  {
    supplierId: 'DIRECT_CONTRACT',
    supplierName: 'Direktni Ugovor (Sol Plaza)',
    reliability: 99,
    responseTimeMs: 50,
    cancellationRate: 0.01,
    items: [
      { type: 'FLIGHT',   description: 'BEG→HRG (direktan)', netPrice: 255, taxes: 40, fees: 10, currency: 'EUR' },
      { type: 'HOTEL',    description: 'Sol Plaza 5* | DBL | AI | 7 noći', netPrice: 720, taxes: 40, currency: 'EUR', destination: 'EG' },
      { type: 'TRANSFER', description: 'Privatni transfer', netPrice: 55, fees: 5, currency: 'EUR' },
    ]
  }
];

async function runRankingTest() {
  console.log('--- 🏆 SUPPLIER RANKING SIMULATOR ---');
  console.log('   Poređenje: Sol Plaza 5* | DBL | All Inclusive | 7N | BEG→HRG\n');

  // ─────────────────────────────────────────────────
  // B2C: Jedan rezultat (klijent ne zna od koga)
  // ─────────────────────────────────────────────────
  const b2c = SupplierRankingService.searchB2C(supplierOffers, 'SUMMER2026', 'contact-123');

  console.log('══════════════════════════════════════════');
  console.log('📱 B2C PRIKAZ (šta vidi klijent na sajtu)');
  console.log('══════════════════════════════════════════');
  console.log(`  Cena paketa:      ${b2c.breakdown.finalTotal} EUR`);
  console.log(`  Uštedeli ste:     ${b2c.breakdown.displaySavings} EUR`);
  console.log(`  Badges:           ${b2c.breakdown.badges.join(', ') || 'none'}`);
  console.log(`  (Interna info)    Pobednik: ${b2c.winner.supplierName} | Score: ${b2c.score} | +${b2c.hiddenCompetitorCount} skrivene opcije`);

  // ─────────────────────────────────────────────────
  // B2B mod 1: Najniža od
  // ─────────────────────────────────────────────────
  const b2bLowest = SupplierRankingService.searchB2B(supplierOffers, 'LOWEST_ONLY', 'agency-456');

  console.log('\n══════════════════════════════════════════');
  console.log('💼 B2B MOD 1: Najniža Cena (brzi mod)');
  console.log('══════════════════════════════════════════');
  b2bLowest.results.forEach(r => {
    console.log(`  Rank #${r.rank} | ${r.offer.supplierName}`);
    console.log(`  Cena: ${r.breakdown.finalTotal} EUR | Marža: ${r.breakdown.marginPercentage}%`);
    console.log(`  Pouzdanost: ${r.offer.reliability}% | Score: ${r.score}`);
  });
  console.log(`  ► Vaša provizija: ${b2bLowest.agencyCommission?.toFixed(2)} EUR`);

  // ─────────────────────────────────────────────────
  // B2B mod 2: Svi dobavljači (transparentni mod)
  // ─────────────────────────────────────────────────
  const b2bAll = SupplierRankingService.searchB2B(supplierOffers, 'ALL_SUPPLIERS', 'agency-456');

  console.log('\n══════════════════════════════════════════');
  console.log('💼 B2B MOD 2: Svi Dobavljači (agent bira)');
  console.log('══════════════════════════════════════════');
  b2bAll.results.forEach(r => {
    const recommended = r.rank === 1 ? '✅ PREPORUČENO' : '';
    console.log(`  Rank #${r.rank} ${recommended}`);
    console.log(`    Dobavljač:  ${r.offer.supplierName}`);
    console.log(`    Cena:       ${r.breakdown.finalTotal} EUR`);
    console.log(`    Marža:      ${r.breakdown.totalMargin} EUR (${r.breakdown.marginPercentage}%)`);
    console.log(`    Pouzdanost: ${r.offer.reliability}% | Brzina: ${r.offer.responseTimeMs}ms`);
    console.log(`    Score:      ${r.score}/100\n`);
  });
  console.log(`  ► Najniža cena ukupno: ${b2bAll.cheapestTotal} EUR`);
  console.log(`  ► Vaša provizija (na najnižoj): ${b2bAll.agencyCommission?.toFixed(2)} EUR`);

  console.log('\n--- ✅ SIMULACIJA ZAVRŠENA ---');
}

runRankingTest();
