import { NeoTravelMasterEngine } from '../src/modules/engine/NeoTravelMasterEngine';
import { DossierService, CreateDossierRequest } from '../src/modules/engine/DossierService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runDossierSimulation() {
  console.log('--- 📁 DOSIJE REZERVACIJE (DOSSIER) SIMULACIJA ---');
  
  // 1. KREIRANJE PONUDE (Korišćenje Master Engine-a)
  const query = "Nađi mi Hurghadu u julu za dvoje sa dvoje dece, do 2000 evra, uz izlete i osiguranje";
  
  const packageResult = await NeoTravelMasterEngine.processFullPackage({
    naturalQuery: query,
    channel: 'B2C'
  });

  console.log('\n--- 🧪 KREIRANJE DOSIJEA ---');
  
  // 2. PRETVARANJE PONUDE U DOSIJE (DOSSIER)
  const req: CreateDossierRequest = {
    packageResult,
    customerName: "Nenad NeoTravel",
    customerEmail: "nenad@example.com",
    customerPhone: "+381 60 1234567"
  };

  const booking = await DossierService.createFromPackage(req);

  // 3. PROVERA SADRŽAJA DOSIJEA (VERIFIKACIJA BAZE)
  console.log('\n--- 📂 SADRŽAJ DOSIJEA (Baza podataka) ---');
  const fullDossier = await DossierService.getFullDossier(booking.id as string);

  if (fullDossier) {
    console.log(`  Dosije Kod:      ${fullDossier.cisCode}`);
    console.log(`  Status:          ${fullDossier.status}`);
    console.log(`  Kupac:           ${fullDossier.bookerName} (${fullDossier.bookerEmail})`);
    console.log(`  Ukupna Cena:     ${fullDossier.totalPrice} ${fullDossier.currency}`);
    console.log(`  Ukupna Marža:    ${fullDossier.totalMarkupAmount} ${fullDossier.currency}`);

    console.log('\n  STAVKE (Booking Items):');
    fullDossier.items.forEach((item: any, idx: number) => {
      console.log(`    ${idx + 1}. [${item.type}] ${item.description}: ${item.totalPrice} EUR (Net: ${item.netPrice} EUR)`);
      if (item.cancelDeadline) console.log(`       📅 Rok za otkazivanje: ${item.cancelDeadline.toLocaleDateString()}`);
    });

    console.log('\n  AKTIVNOSTI (Timeline):');
    fullDossier.activities.forEach((act: any) => {
      console.log(`    [${act.createdAt.toLocaleTimeString()}] ${act.type}: ${act.description} (Agent: ${act.userId})`);
    });

    // 4. TEST ALERTA (Kritični rokovi - Inspirisano Sekcijom 1.1 GitHub-a)
    console.log('\n--- ⚠️ AI PROAKTIVNI ALERTI (Prioriteti) ---');
    // Simuliramo jedan kritičan rok za test
    const alerts = await DossierService.getPriorityAlerts();
    if (alerts.length > 0) {
      alerts.forEach((alert: any) => console.log(`    🔴 ${alert.msg} [Dosije: ${alert.cisCode}]`));
    } else {
      console.log('    ✅ Nema kritičnih rokova u narednih 48h.');
    }

    // 5. PROMENA STATUSA (Workflow Simulacija)
    console.log('\n--- 🔄 WORKFLOW TEST: STATUSNA PROMENA ---');
    await DossierService.updateStatus(booking.id as string, 'PENDING_PAYMENT');
    await DossierService.logActivity(booking.id as string, 'STATUS_CHANGE', 'Status promenjen u PENDING_PAYMENT zbog započete procedure plaćanja.');
    const updatedDossier = await DossierService.getFullDossier(booking.id as string);
    console.log(`  Novi Status:      ${updatedDossier?.status}`);

  } else {
    console.error('Došlo je do greške prilikom dohvatanja dosijea iz baze!');
  }

  // Zatvaranje konekcije sa bazom
  await prisma.$disconnect();
  console.log('\n--- ✅ SIMULACIJA DOSIJEA ZAVRŠENA ---');
}

runDossierSimulation();
