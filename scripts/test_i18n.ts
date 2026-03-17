import { TranslationService, SupportedLanguage } from '../src/core/i18n/TranslationService';
import { SoftZoneService } from '../src/modules/ai/SoftZoneService';
import { BookingEntity } from '../src/modules/booking/BookingEntity';

async function testLocalization(lang: SupportedLanguage) {
  TranslationService.setLanguage(lang);
  console.log(`\n--- 🌐 TESTIRANJE JEZIKA: [${lang.toUpperCase()}] ---`);

  // 1. Testiranje AI signala
  const signals = await SoftZoneService.analyzeDestinationIntel('Egipat', new Date(2026, 6, 15));
  console.log(`AI Signal (${lang}):`, signals[0].message);
  console.log(`AI Sugestija (${lang}):`, signals[0].actionSuggestion);

  // 2. Testiranje Finansijskih labela
  console.log(`Labela za prodajnu cenu (${lang}):`, TranslationService.translate('finance.sell_price'));
}

async function run() {
  await testLocalization('sr');
  await testLocalization('en');
}

run();
