import { BookingEntity } from '../src/modules/booking/BookingEntity';
import { DossierDirector } from '../src/modules/booking/DossierDirector';
import { FinanceOperationalService } from '../src/modules/finance/FinanceOperationalService';
import { BookingRepository } from '../src/modules/booking/BookingRepository';

async function runDossierSimulation() {
  console.log('--- 🚀 NEO-TRAVEL DB-LINKED SIMULATOR START ---');
  
  const repo = new BookingRepository();
  const director = new DossierDirector();

  // 1. KREIRANJE REZERVACIJE
  const cid = `CIS-DB-${Math.floor(Math.random() * 10000)}`;
  const bookingResult = BookingEntity.create({
    cisCode: cid,
    status: 'DRAFT',
    customerType: 'INDIVIDUAL',
    totalPrice: 1250,
    currency: 'EUR',
    bookerName: 'Marko DB-Tester',
    bookerEmail: 'marko.db@example.com',
    aiTokenUsage: 0,
    aiCostAmount: 0
  });

  if (bookingResult.isFailure()) return;
  const booking = bookingResult.value;

  // 2. PRVI UPIS U BAZU
  await repo.save(booking);

  // 3. PROCESIRANJE (AI + Workflow)
  console.log('[Step 2] Director vrši inteligenciju i workflow...');
  const signals = await director.processDossierChange(booking);
  
  console.log('\n--- 🧠 AI INTELLIGENCE SIGNALS ---');
  signals.forEach(s => {
    console.log(`[${s.type}] ${s.severity}: ${s.message}`);
    console.log(`   👉 SUGESTIJA: ${s.actionSuggestion}`);
  });
  console.log('----------------------------------\n');

  // Ažuriramo AI usage (Simulirano)
  const finalBookingResult = BookingEntity.create({
    ...bookingResult.value['props'],
    status: 'OFFER',
    aiTokenUsage: 350,
    aiCostAmount: 0.0007
  });
  
  if (finalBookingResult.isSuccess()) {
    await repo.save(finalBookingResult.value);
  }

  // 4. PROVERA UPISA
  const savedData = await repo.findByCisCode(cid);
  console.log('\n--- 📊 PODACI IZ BAZE (Prisma Query) ---');
  console.log(`Dossier ID: ${savedData?.id}`);
  console.log(`Status: ${savedData?.status}`);
  console.log(`AI Trošak: $${savedData?.aiCostAmount}`);
  console.log('----------------------------------------');

  console.log('\n--- ✅ SIMULACIJA SA BAZOM ZAVRŠENA ---');
}

runDossierSimulation()
  .catch(err => console.error(err))
  .finally(() => process.exit(0));

