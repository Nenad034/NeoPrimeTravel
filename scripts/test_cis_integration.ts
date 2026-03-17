import { NeoTravelMasterEngine } from '../src/modules/engine/NeoTravelMasterEngine';
import { DossierService } from '../src/modules/engine/DossierService';
import { CisIntegrationService } from '../src/modules/engine/CisIntegrationService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runCisDemo() {
  console.log('--- 🛡️ CIS INTEGRACIJA & GARANCIJA PUTOVANJA DEMO ---');

  // 1. Kreiranje Dosijea (Standardni tok)
  const query = "Egipat, jul, 2 odraslih + 2 dece";
  const packageResult = await NeoTravelMasterEngine.processFullPackage({ naturalQuery: query, channel: 'B2C' });
  const booking = await DossierService.createFromPackage({
    packageResult,
    customerName: "Dragan Petrović",
    customerEmail: "dragan@example.com"
  });

  console.log(`\nDOSIJE KREIRAN: ${booking.cisCode}`);

  // 2. UNOS U CIS I KREIRANJE GARANCIJE (Vaš ključni zahtev)
  console.log('\n--- 🔄 POKREĆEM CIS SINHRONIZACIJU... ---');
  const cisResult = await CisIntegrationService.pushToCis(booking.id as string);

  console.log(`\n--- 📂 ANALIZA DOSIJEA NAKON CIS-a ---`);
  
  // Provera dokumenata u bazi
  const documents = await prisma.dossierDocument.findMany({
    where: { bookingId: booking.id }
  });

  const guarantee = documents.find(d => d.type === 'GUARANTEE');

  if (guarantee) {
    console.log(`  ✅ Pronađena GARANCIJA PUTOVANJA:`);
    console.log(`     Broj dokumenta: ${guarantee.documentNo}`);
    console.log(`     Sadržaj (Preview): \n${guarantee.content?.substring(0, 150)}...`);
  } else {
    console.error('  ❌ Greška: Garancija putovanja nije pronađena u dosijeu!');
  }

  // Provera aktivnosti
  const activities = await prisma.dossierActivity.findMany({
    where: { bookingId: booking.id, type: 'CIS_SYNC' }
  });
  
  if (activities.length > 0) {
    console.log(`\n  ✅ TIMELINE POTVRDA: ${activities[0].description}`);
  }

  console.log('\n--- ✅ CIS DEMO ZAVRŠEN ---');
  await prisma.$disconnect();
}

runCisDemo();
