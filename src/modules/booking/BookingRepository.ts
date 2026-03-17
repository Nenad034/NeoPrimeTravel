import { PrismaClient } from '@prisma/client';
import { BookingEntity } from './BookingEntity';

const prisma = new PrismaClient();

export class BookingRepository {
  /**
   * Snima Dossier u bazu podataka.
   */
  public async save(booking: BookingEntity): Promise<void> {
    console.log(`[Repository] Perzistencija dosijea ${booking.cisCode} u bazu...`);
    
    await prisma.booking.upsert({
      where: { cisCode: booking.cisCode },
      update: {
        status: booking.status,
        totalPrice: booking.totalPrice,
        aiTokenUsage: booking.aiTokenUsage || 0,
        aiCostAmount: booking.aiCostAmount || 0,
        updatedAt: new Date()
      },
      create: {
        cisCode: booking.cisCode,
        status: booking.status,
        customerType: 'INDIVIDUAL',
        totalPrice: booking.totalPrice,
        currency: 'EUR',
        bookerName: booking.booker.name,
        bookerEmail: booking.booker.email,
        aiTokenUsage: booking.aiTokenUsage || 0,
        aiCostAmount: booking.aiCostAmount || 0
      }
    });
    
    console.log(`[Repository] Uspešno upisano.`);
  }

  /**
   * Dohvata dosije iz baze.
   */
  public async findByCisCode(cisCode: string) {
    return await prisma.booking.findUnique({
      where: { cisCode },
      include: {
        passengers: true,
        items: true,
        payments: true
      }
    });
  }
}
