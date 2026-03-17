import { Result, ok, fail } from '../../core/error/Result';

export interface BookingItemProps {
  id?: string;
  bookingId: string;
  itemNo: number;
  itemTypeCode: string; // HOTEL, FLIGHT, TRANSFER, ACTIVITY
  supplierId?: string;
  statusCode: string;
  serviceStartDate?: Date;
  serviceEndDate?: Date;
  grossAmount: number;
  netAmount: number;
}

/**
 * BookingItemEntity - Mapirano na tabelu booking.booking_items.
 * Predstavlja pojedinačnu uslugu unutar jednog Dosijea.
 */
export class BookingItemEntity {
  private constructor(private props: BookingItemProps) {}

  public static create(props: BookingItemProps): Result<BookingItemEntity, Error> {
    if (props.itemNo < 1) {
      return fail(new Error('Broj stavke mora biti veći od 0.'));
    }
    return ok(new BookingItemEntity(props));
  }

  get type() { return this.props.itemTypeCode; }
  get status() { return this.props.statusCode; }
}
