import { BookingEntity } from './BookingEntity';
import { BookingItemEntity } from './BookingItemEntity';
import { PassengerEntity } from './PassengerEntity';
import { RoomingRoomEntity } from './RoomingRoomEntity';

/**
 * BookingDossier - Konsolidovani prikaz rezervacije (Agent View).
 * Objedinjuje glavu, stavke, putnike, rooming i finansije.
 */
export class BookingDossier {
  constructor(
    public readonly header: BookingEntity,
    public readonly items: BookingItemEntity[],
    public readonly passengers: PassengerEntity[],
    public readonly rooming: RoomingRoomEntity[] = [],
    public readonly history: any[] = []
  ) {}

  /**
   * Rezime finansijskog stanja Dosijea.
   */
  get financialSummary() {
    return {
      totalSell: this.header.totalAmount,
      itemCount: this.items.length,
      passengers: this.passengers.length
    };
  }

  /**
   * Provera da li su sve stavke potvrđene.
   */
  isFullyConfirmed(): boolean {
    return this.items.every(item => item.status === 'CONFIRMED');
  }
}
