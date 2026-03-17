import { NeoTravelMasterEngine } from '../src/modules/engine/NeoTravelMasterEngine';
import { DossierService } from '../src/modules/engine/DossierService';
import { DocumentGeneratorService } from '../src/modules/engine/DocumentGeneratorService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runDocumentDemo() {
  console.log('--- 📄 DOKUMENTI DOSIJEA (Voucher, Invoice, Proforma) DEMO ---');

  // 1. Kreiranje Dosijea (kao i pre)
  const query = "Hurghada, 2 odraslih, jul, do 2000e";
  const packageResult = await NeoTravelMasterEngine.processFullPackage({ naturalQuery: query, channel: 'B2C' });
  const booking = await DossierService.createFromPackage({
    packageResult,
    customerName: "Marko Marković",
    customerEmail: "marko@example.com"
  });

  console.log(`\n--- 🛠️ GENERISANJE DOKUMENATA ZA DOSIJE ${booking.cisCode} ---`);

  // 2. Generisanje PROFORME (Kada je buking napravljen)
  const proforma = await DocumentGeneratorService.generateDocument(booking.id as string, 'PROFORMA');
  console.log(`  [OK] Izdata Profaktura: ${proforma.documentNo}`);

  // 3. Simulacija plaćanja i generisanje FAKTURE i VAUČERA
  console.log('\n--- 💰 SIMULACIJA UPLATE & FINALIZACIJE ---');
  await DossierService.updateStatus(booking.id as string, 'PAID');
  
  const invoice = await DocumentGeneratorService.generateDocument(booking.id as string, 'INVOICE');
  const voucher = await DocumentGeneratorService.generateDocument(booking.id as string, 'VOUCHER');

  console.log(`  [OK] Izdata Faktura:  ${invoice.documentNo}`);
  console.log(`  [OK] Izdat Vaučer:    ${voucher.documentNo}`);

  // 4. Provera svih dokumenata u Dosijeu
  const fullDossier = await DossierService.getFullDossier(booking.id as string);
  console.log('\n--- 📂 KONAČNI PREGLED DOKUMENATA U DOSIJEU ---');
  
  // Napomena: Treba dodati include: { documents: true } u getFullDossier da bi se videli
  const docs = await prisma.dossierDocument.findMany({ where: { bookingId: booking.id } });
  
  docs.forEach(doc => {
    console.log(`    - ${doc.type} [${doc.documentNo}] izdat ${doc.issuedAt.toLocaleTimeString()}`);
  });

  console.log('\n--- ✅ DEMO DOKUMENATA ZAVRŠEN ---');
  await prisma.$disconnect();
}

runDocumentDemo();
