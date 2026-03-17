import { Result, ok, fail } from '../../core/error/Result';

export type PassengerType = 'ADULT' | 'CHILD' | 'INFANT';

export interface PassengerProps {
  id?: string;
  bookingId: string;
  roomingRoomId?: string; // Link to specific room assignment
  firstName: string;
  lastName: string;
  type: PassengerType;
  birthDate?: Date;
  passportNo?: string;
  specialRequests?: string;
  isLead: boolean;
}

/**
 * PassengerEntity - Mapirano na tabelu Passenger u novoj šemi.
 * Putnici pridruženi rezervaciji i opcionalno sobi.
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
  get type() { return this.props.type; }
  get roomingRoomId() { return this.props.roomingRoomId; }
}

