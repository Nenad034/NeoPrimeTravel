import { Result, ok, fail } from '../../core/error/Result';
import { BookingEntity } from './BookingEntity';
import { BookingItemEntity } from './BookingItemEntity';
import { PassengerEntity } from './PassengerEntity';

/**
 * BookingService - Srce operativnog procesa.
 * Odgovoran za kreiranje Dosijea i upravljanje statusima.
 */
export class BookingService {
  /**
   * Kreira novu rezervaciju (Booking Dossier).
   * Pravilo: Generiše jedinstvenu referencu i sumira stavke.
   */
  async createBooking(
    userId: string,
    items: BookingItemEntity[],
    passengers: PassengerEntity[]
  ): Promise<Result<BookingEntity, Error>> {
    try {
      const ref = `BK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      const totalSell = items.reduce((sum, item) => sum + (item as any).props.grossAmount, 0);
      const totalNet = items.reduce((sum, item) => sum + (item as any).props.netAmount, 0);

      const bookingResult = BookingEntity.create({
        bookingReference: ref,
        bookingTypeCode: 'DYNAMIC_PACKAGE',
        userId,
        statusCode: 'DRAFT',
        currencyCode: 'EUR',
        totalSellAmount: totalSell,
        totalNetAmount: totalNet,
      });

      if (bookingResult.isFailure()) return fail(bookingResult.error);

      console.log(`[BookingEngine] Kreiran dosije ${ref} sa ${items.length} stavki i ${passengers.length} putnika.`);
      
      return ok(bookingResult.value);
    } catch (error) {
      return fail(error as Error);
    }
  }

  /**
   * Voucher Generator - Izdaje dokumente.
   * Pravilo: Samo za CONFIRMED rezervacije.
   */
  async generateVoucher(booking: BookingEntity): Promise<Result<string, Error>> {
    if (!booking.canIssueVoucher()) {
      return fail(new Error('Vaučer se može izdati samo za potvrđene rezervacije.'));
    }
    
    const voucherKey = `VOUCH-${booking.reference}.pdf`;
    console.log(`[BookingEngine] Generisan vaučer: ${voucherKey}`);
    
    return ok(voucherKey);
  }
}
