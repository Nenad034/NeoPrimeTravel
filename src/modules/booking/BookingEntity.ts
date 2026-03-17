import { Result, ok, fail } from '../../core/error/Result';

export type BookingStatus = 'DRAFT' | 'OFFER' | 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
export type CustomerType = 'INDIVIDUAL' | 'LEGAL' | 'AGENT';

export interface BookingProps {
  id?: string;
  cisCode: string;
  externalRef?: string;
  status: BookingStatus;
  customerType: CustomerType;
  totalPrice: number;
  currency: string;
  aiTokenUsage?: number;
  aiCostAmount?: number;
  bookerName: string;
  bookerEmail: string;
  bookerPhone?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * BookingEntity - Mapirano na tabelu Booking u novoj šemi.
 * Predstavlja centralni Dossier entitet.
 */
export class BookingEntity {
  private constructor(private props: BookingProps) {}

  public static create(props: BookingProps): Result<BookingEntity, Error> {
    if (!props.cisCode) {
      return fail(new Error('CIS kod (Globalna referenca) je obavezan.'));
    }
    return ok(new BookingEntity({
      ...props,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date()
    }));
  }

  get id() { return this.props.id; }
  get cisCode() { return this.props.cisCode; }
  get status() { return this.props.status; }
  get totalPrice() { return this.props.totalPrice; }
  get aiTokenUsage() { return this.props.aiTokenUsage; }
  get aiCostAmount() { return this.props.aiCostAmount; }
  get booker() { return { name: this.props.bookerName, email: this.props.bookerEmail }; }

  /**
   * Provera da li je dozvoljeno izdavanje vaučera.
   * U novoj šemi, vaučer zahteva status CONFIRMED.
   */
  canIssueVoucher(): boolean {
    return this.props.status === 'CONFIRMED';
  }
}

