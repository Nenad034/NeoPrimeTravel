import { Result, ok, fail } from '../../core/error/Result';

export type BookingStatus = 'DRAFT' | 'CONFIRMED' | 'CANCELLED' | 'PENDING_PAYMENT';

export interface BookingProps {
  id?: string;
  bookingReference: string;
  bookingTypeCode: string;
  userId?: string;
  contactId?: string;
  agencyId?: string;
  offerId?: string;
  statusCode: BookingStatus;
  currencyCode: string;
  travelStartDate?: Date;
  travelEndDate?: Date;
  totalSellAmount: number;
  totalNetAmount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * BookingEntity - Mapirano na tabelu booking.bookings.
 * Predstavlja glavnu glavu rezervacije (Dossier Header).
 */
export class BookingEntity {
  private constructor(private props: BookingProps) {}

  public static create(props: BookingProps): Result<BookingEntity, Error> {
    if (!props.bookingReference) {
      return fail(new Error('Referenca rezervacije je obavezna.'));
    }
    return ok(new BookingEntity({
      ...props,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date()
    }));
  }

  get id() { return this.props.id; }
  get reference() { return this.props.bookingReference; }
  get status() { return this.props.statusCode; }
  get totalAmount() { return this.props.totalSellAmount; }

  /**
   * Provera da li je dozvoljeno izdavanje vaučera.
   */
  canIssueVoucher(): boolean {
    return this.props.statusCode === 'CONFIRMED';
  }
}
