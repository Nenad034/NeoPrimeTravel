import { SearchEngine } from '../src/modules/search/SearchEngine';
import { AISearchService } from '../src/modules/search/AISearchService';
import { TranslationService } from '../src/core/i18n/TranslationService';

async function runAiSearchSimulation() {
  console.log('--- 🤖 NEO-TRAVEL AI SEARCH SIMULATOR ---');
  
  const engine = new SearchEngine();
  const query = "Nađi mi hotel u Egiptu za dvoje sa dvoje dece u julu, do 2000 evra, blizu peščane plaže";

  console.log(`\nAGENTSKI UPIT: "${query}"`);

  // 1. Izvršavanje AI pretrage
  const result = await engine.searchByNaturalLanguage(query);

  if (result.isSuccess()) {
    const { criteria, results } = result.value;

    // 2. Interpretacija onoga što je AI razumeo
    console.log('\n--- 🧠 ŠTA JE SISTEM RAZUMEO ---');
    console.log(AISearchService.generateQuerySummary(criteria));
    console.log('------------------------------');

    // 3. Prikaz rezultata
    console.log(`\nPronađeno ${results.length} objekata:`);
    results.forEach(r => {
      console.log(`\n🏨 OBJEKAT: ${r.productName}`);
      console.log(`   Analiza: ${r.aiAnalysis?.summary}`);
      console.log(`   Dostupne ponude: ${r.offers.length}`);
      
      r.offers.forEach(o => {
        console.log(`   - ${o.ratePlanName}: ${o.grossAmount} ${o.currency}`);
      });
    });

  } else {
    console.error('Greška u pretrazi:', result.error);
  }

  console.log('\n--- ✅ SIMULACIJA AI PRETRAGE ZAVRŠENA ---');
}

runAiSearchSimulation();
