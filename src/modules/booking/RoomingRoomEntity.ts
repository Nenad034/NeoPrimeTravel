import { Result, ok, fail } from '../../core/error/Result';

export interface RoomingRoomProps {
  id?: string;
  roomingSetId: string;
  roomNo: number;
  roomTypeCode: string;
  boardTypeCode: string;
  adultsCount: number;
  childrenCount: number;
  infantCount: number;
  passengerIds: string[]; // Putnici dodeljeni ovoj sobi
  status: 'DRAFT' | 'ASSIGNED' | 'CONFIRMED';
  hotelConfirmationCode?: string;
  roomNumberAtHotel?: string; // Broj sobe na licu mesta (npr. 305)
}

/**
 * RoomingRoomEntity - Raspodela putnika u konkretnu sobu.
 * Mapirano na logiku iz dela 4 i 9 operativne dokumentacije.
 */
export class RoomingRoomEntity {
  private constructor(private props: RoomingRoomProps) {}

  public static create(props: RoomingRoomProps): Result<RoomingRoomEntity, Error> {
    const totalPax = props.adultsCount + props.childrenCount;
    if (props.passengerIds.length > totalPax) {
      return fail(new Error(`Broj putnika (${props.passengerIds.length}) premašuje kapacitet sobe (${totalPax}).`));
    }
    return ok(new RoomingRoomEntity(props));
  }

  get roomNo() { return this.props.roomNo; }
  get passengerCount() { return this.props.passengerIds.length; }
  get status() { return this.props.status; }

  /**
   * Provera da li je soba puna prema definisanom occupancy-ju.
   */
  isFull(): boolean {
    return this.props.passengerIds.length === (this.props.adultsCount + this.props.childrenCount);
  }
}
