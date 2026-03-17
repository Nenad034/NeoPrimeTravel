import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export type DocumentType = 'PROFORMA' | 'INVOICE' | 'VOUCHER' | 'RECEIPT';

/**
 * DocumentGeneratorService
 * 
 * Odgovoran za kreiranje zvaničnih dokumenata iz Dosijea.
 * Inspirisano "OlympicHub Reservations" modulom.
 */
export class DocumentGeneratorService {

  /**
   * Generiše novi dokument za dati Dosije.
   */
  public static async generateDocument(bookingId: string, type: DocumentType, agentId: string = 'SYSTEM_AI') {
    console.log(`[DocumentGenerator] Generišem ${type} za dosije: ${bookingId}...`);

    // 1. Dohvatanje podataka iz Dosijea
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { items: true, passengers: true }
    });

    if (!booking) throw new Error('Dosije nije pronađen!');

    // 2. Generisanje broja dokumenta (Logika iz domena 8)
    const year = new Date().getFullYear();
    const prefix = type === 'PROFORMA' ? 'PF' : type === 'INVOICE' ? 'FA' : type === 'VOUCHER' ? 'VC' : 'PR';
    const documentNo = `${prefix}-${year}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 3. Kreiranje sadržaja (Simulacija HTML/PDF templejta)
    const content = `
      =========================================
      NEO TRAVEL - ${type} #${documentNo}
      =========================================
      Klijent: ${booking.bookerName}
      Datum: ${new Date().toLocaleDateString()}
      -----------------------------------------
      Stavke:
      ${booking.items.map(i => `- ${i.description}: ${i.totalPrice} ${i.currency}`).join('\n')}
      -----------------------------------------
      UKUPNO ZA UPLATU: ${booking.totalPrice} ${booking.currency}
      =========================================
    `;

    // 4. Čuvanje u bazu (DossierDocument)
    const doc = await prisma.dossierDocument.create({
      data: {
        bookingId: booking.id,
        type: type,
        documentNo: documentNo,
        content: content,
        issuedBy: agentId,
        isFinal: type === 'INVOICE' || type === 'VOUCHER'
      }
    });

    // 5. Logovanje aktivnosti u Timeline
    await prisma.dossierActivity.create({
      data: {
        bookingId: booking.id,
        type: 'DOC_ISSUED',
        description: `Izdat dokument: ${type} (Ref: ${documentNo})`,
        userId: agentId
      }
    });

    console.log(`[DocumentGenerator] Uspešno kreiran ${type}: ${documentNo}`);
    return doc;
  }
}
