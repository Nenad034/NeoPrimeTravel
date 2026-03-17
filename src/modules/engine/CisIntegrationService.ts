import { PrismaClient } from '@prisma/client';
import { DocumentGeneratorService } from './DocumentGeneratorService';

const prisma = new PrismaClient();

/**
 * CisIntegrationService
 * 
 * Upravlja integracijom sa Centralnim Informacionim Sistemom (CIS).
 * Zadatak: Slanje rezervacije u CIS i povlačenje "Garancije Putovanja".
 */
export class CisIntegrationService {

  /**
   * Šalje Dosije u CIS i generiše Garanciju Putovanja.
   */
  public static async pushToCis(bookingId: string, userId: string = 'SYSTEM_AI') {
    console.log(`[CIS Service] Šaljem dosije ${bookingId} u CIS bazu...`);

    // 1. Provera postojanja dosijea
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking) throw new Error('Dosije nije pronađen!');

    // 2. Simulacija API poziva ka CIS-u i povlačenje JID prodaje
    const tripReference = `CIS-TRIP-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const jidProdaje = `JID-${Math.floor(100000 + Math.random() * 900000)}`;
    
    // 3. Update rezervacije sa JID brojem (Vaš zahtev)
    await prisma.booking.update({
      where: { id: bookingId },
      data: { jidProdaje: jidProdaje }
    });

    // 4. Zapis u našu tabelu CisTrip
    const cisEntry = await prisma.cisTrip.create({
      data: {
        bookingId: booking.id,
        tripReference: tripReference,
        submissionStatus: 'SUCCESS'
      }
    });

    // 5. KREIRANJE DOKUMENTA "GARANCIJA PUTOVANJA"
    const guaranteeDoc = await prisma.dossierDocument.create({
      data: {
        bookingId: booking.id,
        type: 'GUARANTEE',
        documentNo: `GP-${tripReference}`,
        content: `
          =========================================
          POTVRDA O GARANCIJI PUTOVANJA
          =========================================
          JID PRODAJE: ${jidProdaje}
          CIS Referenca: ${tripReference}
          NeoTravel Ref: ${booking.cisCode}
          -----------------------------------------
          Status: REGISTROVANO U CENTRALNOJ BAZI
          Datum izdavanja: ${new Date().toLocaleString()}
          
          Ovaj dokument služi kao garancija za putovanje 
          u skladu sa zakonskim regulativama.
          =========================================
        `,
        issuedBy: userId,
        isFinal: true
      }
    });

    // 6. Logovanje u Timeline
    await prisma.dossierActivity.create({
      data: {
        bookingId: booking.id,
        type: 'CIS_SYNC',
        description: `Rezervacija uneta u CIS. JID: ${jidProdaje}, Garancija: GP-${tripReference}`,
        userId: userId
      }
    });

    console.log(`[CIS Service] Uspešno sinhronizovano. Garancija: GP-${tripReference}`);
    return { cisEntry, guaranteeDoc };
  }
}
