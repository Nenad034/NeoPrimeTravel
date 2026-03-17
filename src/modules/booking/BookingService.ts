import { Result, ok, fail } from '../../core/error/Result';
import { SecurityProvider, UserContext } from '../../core/auth/SecurityProvider';
import { IEventBus } from '../../core/bus/EventBus';

/**
 * Booking Service - Primer "kičme" biznis logike.
 * Pokazuje kako se koriste Core komponente za stabilnost i sigurnost.
 */
export class BookingService {
  constructor(private eventBus: IEventBus) {}

  async createBooking(user: UserContext, bookingData: any): Promise<Result<string, Error>> {
    // 1. SIGURNOST: Provera dozvole
    if (!SecurityProvider.hasPermission(user, 'booking.create')) {
      return fail(new Error('Nemate dozvolu za kreiranje rezervacije.'));
    }

    try {
      // 2. STABILNOST: Logika validacije i čuvanja (Simulacija)
      console.log('Čuvanje rezervacije u bazu...', SecurityProvider.maskSensitiveData(bookingData));
      
      const bookingId = `BK-${Date.now()}`;

      // 3. NADOGRADIVOST: Emitovanje događaja umesto direktnog pozivanja drugih modula
      await this.eventBus.publish({
        eventName: 'booking.created',
        occurredAt: new Date(),
        payload: { bookingId, userId: user.id },
        correlationId: `corr-${bookingId}`
      });

      return ok(bookingId);
    } catch (error) {
      // 2. STABILNOST: Handle neočekivanih grešaka
      return fail(error instanceof Error ? error : new Error('Nepoznata greška pri listanju.'));
    }
  }
}
