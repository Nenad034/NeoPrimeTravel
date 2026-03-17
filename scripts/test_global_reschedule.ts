import { NeoTravelMasterEngine } from '../src/modules/engine/NeoTravelMasterEngine';
import { DossierService } from '../src/modules/engine/DossierService';
import { ReservationArchitectService } from '../src/modules/engine/ReservationArchitectService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runGlobalRescheduleDemo() {
  console.log('--- 🌍 GLOBAL PACKAGE RESCHEDULE & PRICE VERIFICATION DEMO ---');

  // 1. Kreiramo bogat paket (Hotel + Flight + Transfer)
  console.log('\n[1] Kreiranje inicijalnog paketa...');
  const packageResult = await NeoTravelMasterEngine.processFullPackage({
    naturalQuery: "Beč, dvoje odraslih, septembar, hotel i let",
    channel: 'B2C'
  });

  const booking = await DossierService.createFromPackage({
    packageResult,
    customerName: "Petar Petrović",
    customerEmail: "petar@example.com"
  });

  console.log(`\nDOSIJE KREIRAN: ${booking.cisCode}`);
  console.log(`Inicijalna ukupna cena: ${booking.totalPrice} EUR`);
  console.log('Stavke u dosijeu:');
  booking.items.forEach(i => {
    console.log(`  - ${i.description} (${i.startDate?.toLocaleDateString()} - ${i.endDate?.toLocaleDateString()}) | Net: ${i.netPrice}`);
  });

  // 2. IZVRŠAVAMO GLOBALNI RESCHEDULE (Drag & Drop let)
  // Pomeramo let za 10 dana unapred
  const flightItem = booking.items.find(i => i.type === 'FLIGHT');
  if (flightItem && flightItem.startDate && flightItem.endDate) {
    const newStart = new Date(flightItem.startDate.getTime() + 10 * 24 * 60 * 60 * 1000);
    const newEnd = new Date(flightItem.endDate.getTime() + 10 * 24 * 60 * 60 * 1000);
    
    console.log(`\n[2] IZVRŠAVAM GLOBALNI POMERAJ: Pomeram let za 10 dana (syncAll: true)...`);
    await ReservationArchitectService.rescheduleItem(flightItem.id, newStart, newEnd, true);
  }

  // 3. PROVERA REZULTATA
  const updatedDossier = await DossierService.getFullDossier(booking.id);
  
  console.log('\n[3] REZULTAT GLOBALNOG POMERAJA:');
  console.log(`NOVA UKUPNA CENA (Verifikovana): ${updatedDossier?.totalPrice} EUR`);
  console.log('Ažurirane stavke:');
  updatedDossier?.items.forEach(i => {
    console.log(`  - ${i.description} (${i.startDate?.toLocaleDateString()} - ${i.endDate?.toLocaleDateString()}) | Novi Net: ${i.netPrice}`);
  });

  console.log('\n--- 📂 TIMELINE PROVERA ---');
  updatedDossier?.activities.forEach(act => {
    console.log(`    [${act.type}] ${act.description}`);
  });

  console.log('\n--- ✅ GLOBAL RESCHEDULE DEMO ZAVRŠEN ---');
  await prisma.$disconnect();
}

runGlobalRescheduleDemo();
