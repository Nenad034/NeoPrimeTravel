import { NeoTravelMasterEngine, DynamicPackageRequest } from '../src/modules/engine/NeoTravelMasterEngine';
import { TranslationService } from '../src/core/i18n/TranslationService';

async function runFinalDemo() {
  console.log('--- 🚀 NEO-TRAVEL FINAL MASTER ENGINE DEMO (FULL BUNDLE) ---');
  
  // Scenarij: Putovanje u Egipat sa dvoje dece, do 2000 evra, uz izlete i ulaznice
  const query = "Nađi mi hotel u Egiptu za dvoje sa dvoje dece u julu, do 2000 evra, blizu peščane plaže, uključujući krstarenje Nilom i ulaznicu za akvarijum";

  console.log(`\nAGENTSKI UPIT: "${query}"`);

  // Postavljamo srpski jezik za demonstraciju
  TranslationService.setLanguage('sr');

  const request: DynamicPackageRequest = {
    naturalQuery: query,
    channel: 'B2C'
  };

  // 1. Izvršavanje Master Engine-a (NLP -> Mapping -> Math -> Pricing)
  const result = await NeoTravelMasterEngine.processFullPackage(request);

  // 2. Prikaz finalnog rezultata koji se šalje agentu/sajtu
  console.log('\n--- 🧠 ANALIZA UPITA (Šta je AI razumeo) ---');
  console.log(result.searchSummary);
  console.log(`  Sastav:   ${result.occupancyDetails}`);

  console.log('\n--- 🏨 MASTER HOTEL INFO ---');
  console.log(`  ID:       ${result.masterHotelId}`);
  console.log(`  Naziv:    ${result.masterHotelName}`);
  console.log(`  Badževi:  ${result.breakdown.badges.join(', ')}`);

  console.log('\n--- 💰 KOMPLETAN PAKET (Finansijski Breakdown) ---');
  console.log('  Stavke u paketu:');
  result.breakdown.items.forEach(item => {
    console.log(`    - [${item.type}] ${item.description}: ${item.sellPrice} ${item.currency}`);
  });
  
  console.log(`\n  Sumarno:`);
  console.log(`    UKUPNO:          ${result.breakdown.itemsTotal} EUR`);
  console.log(`    PAKETNI POPUST: -${result.breakdown.bundleDiscount} EUR`);
  console.log(`    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`    KONAČNA CENA:    ${result.breakdown.finalTotal} EUR`);
  console.log(`    MARŽA AGENCIJE:  ${result.breakdown.totalMargin} EUR (${result.breakdown.marginPercentage}%)`);

  console.log('\n--- 🚫 OTKAZIVANJE & PRAVILA ---');
  console.log(`  Politika:         ${result.cancellationPolicy}`);
  console.log(`  Trenutni penal:   ${result.currentCancelPenalty} EUR`);

  console.log('\n--- ✨ AI INSIGHTS ---');
  result.aiInsights.forEach(insight => console.log(`  🔹 ${insight}`));

  console.log('\n--- ✅ SIMULACIJA FINALA ZAVRŠENA ---');
}

runFinalDemo();
