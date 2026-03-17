import { Result, ok, fail } from '../../core/error/Result';

export interface PassengerProps {
  id?: string;
  bookingId: string;
  passengerNo: number;
  passengerTypeCode: 'ADULT' | 'CHILD' | 'INFANT';
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  passportNumber?: string;
  passportExpiryDate?: Date;
}

/**
 * PassengerEntity - Mapirano na tabelu booking.booking_passengers.
 * Putnici pridruženi rezervaciji.
 */
export class PassengerEntity {
  private constructor(private props: PassengerProps) {}

  public static create(props: PassengerProps): Result<PassengerEntity, Error> {
    if (!props.firstName || !props.lastName) {
      return fail(new Error('Ime i prezime putnika su obavezni.'));
    }
    return ok(new PassengerEntity(props));
  }

  get fullName() { return `${this.props.firstName} ${this.props.lastName}`; }
}
