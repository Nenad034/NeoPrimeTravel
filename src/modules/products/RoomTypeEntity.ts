import { Result, ok, fail } from '../../core/error/Result';

export interface RoomTypeProps {
  id?: string;
  hotelId: string; // Veza ka product.hotels.id
  roomCode: string; // npr. 'DBL_STD'
  name: string; // npr. 'Double Standard Room'
  locationDesc?: string; // npr. 'Sea View', 'Garden View' (Važno za 100% mapping pravilo)
  maxAdults: number;
  maxChildren: number;
  maxInfants: number;
  extraBedAllowed: boolean;
  babyCotAllowed: boolean;
  statusCode: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
}

/**
 * RoomTypeEntity - Mapirano na tabelu product.hotel_room_types iz SQL-a.
 * Poseban akcenat stavljen na kombinaciju Ime + Lokacija prema vašem zahtevu.
 */
export class RoomTypeEntity {
  private constructor(private props: RoomTypeProps) {}

  public static create(props: RoomTypeProps): Result<RoomTypeEntity, Error> {
    if (!props.roomCode || !props.name) {
      return fail(new Error('Kod i naziv sobe su obavezni.'));
    }

    if (props.maxAdults < 1) {
      return fail(new Error('Mora postojati bar jedan kapacitet za odrasle.'));
    }

    return ok(new RoomTypeEntity(props));
  }

  get id() { return this.props.id; }
  get fullRoomName() { 
    return this.props.locationDesc 
      ? `${this.props.name} (${this.props.locationDesc})` 
      : this.props.name; 
  }

  /**
   * Pravilo provere kapaciteta za putnike (Room Assign Logic)
   */
  canAccommodate(adults: number, children: number): boolean {
    return adults <= this.props.maxAdults && children <= this.props.maxChildren;
  }
}
