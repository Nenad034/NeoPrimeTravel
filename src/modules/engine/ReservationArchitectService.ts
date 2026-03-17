import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * ReservationArchitectService
 * 
 * "Mišići" iza vizuelnog interfejsa. Podržava Drag & Drop operacije:
 * 1. Premeštanje putnika između soba.
 * 2. Promena termina usluga u kalendaru.
 */
export class ReservationArchitectService {

  /**
   * MOVE PASSENGER (Rooming Drag & Drop)
   * Premešta putnika iz jedne sobe u drugu uz validaciju kapaciteta.
   */
  public static async movePassenger(passengerId: string, targetRoomId: string, agentId: string = 'SYSTEM_AI') {
    console.log(`[Architect] Premeštam putnika ${passengerId} u sobu ${targetRoomId}...`);

    // 1. Dohvatanje sobe i njenih parametara (Occupancy Check)
    const targetRoom = await prisma.roomingRoom.findUnique({
      where: { id: targetRoomId },
      include: { roomType: true, passengers: true }
    });

    if (!targetRoom) throw new Error('Ciljna soba nije pronađena.');

    // Validacija: Da li ima mesta?
    if (targetRoom.passengers.length >= targetRoom.roomType.maxOccupancy) {
      throw new Error(`Soba ${targetRoom.roomType.name} je već puna (Maks: ${targetRoom.roomType.maxOccupancy}).`);
    }

    // 2. Izvršavanje "premeštanja"
    const updatedPassenger = await prisma.passenger.update({
      where: { id: passengerId },
      data: { roomingRoomId: targetRoomId },
      include: { booking: true }
    });

    // 3. Logovanje u Timeline (Audit Trail)
    await prisma.dossierActivity.create({
      data: {
        bookingId: updatedPassenger.bookingId,
        type: 'PASSENGER_MOD',
        description: `Putnik ${updatedPassenger.firstName} ${updatedPassenger.lastName} premešten u sobu: ${targetRoom.roomType.name}`,
        userId: agentId,
        metadata: JSON.stringify({ passengerId, targetRoomId })
      }
    });

    return updatedPassenger;
  }

  /**
   * RESCHEDULE ITEM (Calendar Drag & Drop)
   * Menja start/end datum usluge i automatski ažurira Dosije.
   * Ako je syncAll = true, pomera SVE stavke u paketu za isti broj dana.
   */
  public static async rescheduleItem(
    itemId: string, 
    newStart: Date, 
    newEnd: Date, 
    syncAll: boolean = false, 
    agentId: string = 'SYSTEM_AI'
  ) {
    console.log(`[Architect] Reschedule stavke ${itemId}. SyncAll: ${syncAll}`);

    // 1. Dohvatanje originalne stavke
    const originalItem = await prisma.bookingItem.findUnique({
      where: { id: itemId },
      include: { booking: true }
    });

    if (!originalItem) throw new Error('Stavka nije pronađena.');
    if (!originalItem.startDate) throw new Error('Stavka nema definisan početni datum.');

    // 2. Izračunavanje razlike (Offset)
    const msOffset = newStart.getTime() - originalItem.startDate.getTime();
    const daysOffset = Math.round(msOffset / (1000 * 60 * 60 * 24));

    // 3. Ažuriranje stavki
    if (syncAll) {
      console.log(`[Architect] Sinhronizujem ceo paket za ${daysOffset} dana...`);
      const allItems = await prisma.bookingItem.findMany({
        where: { bookingId: originalItem.bookingId }
      });

      for (const item of allItems) {
        if (!item.startDate || !item.endDate) continue;
        
        const itemNewStart = new Date(item.startDate.getTime() + msOffset);
        const itemNewEnd = new Date(item.endDate.getTime() + msOffset);

        await prisma.bookingItem.update({
          where: { id: item.id },
          data: {
            startDate: itemNewStart,
            endDate: itemNewEnd,
            // Simulacija promene nabavne cene zbog promene termina (npr. vikend doplate ili sezonalnost)
            // U realnosti ovde ide novi API poziv dobavljaču
            netPrice: Number(item.netPrice) * (1 + (Math.random() * 0.1 - 0.05)) // +/- 5% varijacija cene
          }
        });
      }
    } else {
      await prisma.bookingItem.update({
        where: { id: itemId },
        data: { startDate: newStart, endDate: newEnd }
      });
    }

    // 4. VERIFIKACIJA I PRERAČUNAVANJE CENA (Financial Realignment)
    await this.recalculateBookingFinances(originalItem.bookingId, agentId);

    // 5. Logovanje u Timeline
    await prisma.dossierActivity.create({
      data: {
        bookingId: originalItem.bookingId,
        type: 'PRICE_UPDATE',
        description: syncAll 
          ? `Ceo paket pomeren za ${daysOffset} dana. Izvršena ponovna verifikacija cena.` 
          : `Termin stavke "${originalItem.description}" izmenjen. Preračunate finansije.`,
        userId: agentId
      }
    });

    return originalItem.bookingId;
  }

  /**
   * RECALCULATE BOOKING FINANCES
   * Proverava sve stavke u dosijeu i ponovo pokreće Pricing Engine.
   * Osigurava da su marže, takse i popusti uvek tačni nakon ručnih izmena.
   */
  public static async recalculateBookingFinances(bookingId: string, agentId: string = 'SYSTEM_AI') {
    console.log(`[Architect] Preračunavam finansije za dosije: ${bookingId}...`);

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { items: true }
    });

    if (!booking) return;

    // Mapiramo trenutne stavke u PricingItem format za Engine
    const pricingItems = booking.items.map((i: any) => ({
      type: i.type as any,
      description: i.description,
      netPrice: Number(i.netPrice),
      taxes: Number(i.taxAmount),
      currency: i.currency
    }));

    // Pozivamo Pricing Engine (B2C po defaultu za ovaj demo)
    const newBreakdown = require('./PackagePricingEngine').PackagePricingEngine.calculatePackage(pricingItems, 'B2C');

    // Ažuriramo glavne finansijske podatke u Booking-u
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        totalPrice: newBreakdown.finalTotal,
        totalNetPrice: newBreakdown.totalNet,
        totalMarkupAmount: newBreakdown.totalMargin,
        totalDiscountAmount: newBreakdown.displaySavings
      }
    });

    console.log(`[Architect] Finansije ažurirane. Nova ukupna cena: ${newBreakdown.finalTotal} ${booking.currency}`);
  }
}
