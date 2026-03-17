import { Result, ok, fail } from '../../core/error/Result';

export interface PaymentProps {
  id?: string;
  bookingId: string;
  payerType: 'CUSTOMER' | 'AGENCY' | 'PARTNER';
  amount: number;
  currency: string;
  status: 'PENDING' | 'CONFIRMED' | 'FAILED';
  paidAt?: Date;
}

/**
 * PaymentEntity - Mapirano na finance_payments.
 */
export class PaymentEntity {
  private constructor(private props: PaymentProps) {}

  public static create(props: PaymentProps): Result<PaymentEntity, Error> {
    if (props.amount <= 0) return fail(new Error('Iznos uplate mora biti veći od 0.'));
    return ok(new PaymentEntity(props));
  }

  get id() { return this.props.id; }
  get amount() { return this.props.amount; }
  get bookingId() { return this.props.bookingId; }
}
