import { AdvancedMathEngine, CancellationStep, OccupancyConfig } from '../src/modules/engine/AdvancedMathEngine';

async function runMathTest() {
  console.log('--- 🧪 ADVANCED MATH ENGINE TEST (CHILDREN & CANCELLATIONS) ---');

  // Test 1: Dečija occupancy kalkulacija (Sekcija 11.1)
  const roomPrice2Ad = 800; // Cena sobe za 2 odrasle osobe (Total)
  const familyConfig: OccupancyConfig = {
    adults: 2,
    children: 2,
    childAges: [1, 7] // 1 (beba), 7 (dete 2-12)
  };

  const occupancyResult = AdvancedMathEngine.calculateOccupancyPrice(roomPrice2Ad, familyConfig);

  console.log('\n🏠 OCCUPANCY PRICING (Sastav putnika)');
  console.log(`  Baza (2 odr):    ${roomPrice2Ad} EUR`);
  console.log(`  Doplate:         +${occupancyResult.supplements} EUR`);
  console.log(`  Popusti:         -${occupancyResult.discounts} EUR`);
  console.log(`  Konačna cena:    ${occupancyResult.finalPrice} EUR`);
  console.log(`  Detalji:         ${occupancyResult.details}`);

  // Test 2: Politika otkazivanja (Sekcija 21)
  const totalPrice = 1200;
  const travelDate = new Date();
  travelDate.setDate(travelDate.getDate() + 10); // Putovanje je za 10 dana

  const policies: CancellationStep[] = [
    { daysBefore: 30, percent: 10 },  // 30 dana: 10%
    { daysBefore: 14, percent: 50 },  // 14 dana: 50%
    { daysBefore: 7,  percent: 80 },  // 7 dana: 80%
    { daysBefore: 1,  percent: 100 }  // 1 dan: 100%
  ];

  const cancelResult = AdvancedMathEngine.calculateCancellationPenalty(totalPrice, policies, travelDate);

  console.log('\n🚫 CANCELLATION ENGINE (Penali otkazivanja)');
  console.log(`  Ukupna cena:     ${totalPrice} EUR`);
  console.log(`  Politika:        ${cancelResult.policyDescription}`);
  console.log(`  Status (Danas):  Put za 10 dana`);
  console.log(`  Trenutni penal:  ${cancelResult.currentPenalty} EUR (${(cancelResult.currentPenalty/totalPrice)*100}%)`);
  console.log(`  Non-refundable:  ${cancelResult.isNonRefundable ? 'DA' : 'NE'}`);

  console.log('\n--- ✅ TEST ZAVRŠEN ---');
}

runMathTest();
