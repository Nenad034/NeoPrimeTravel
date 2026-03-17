import { Result, ok, fail } from '../../core/error/Result';

export interface RoomingRoomProps {
  id?: string;
  roomingSetId: string;
  roomTypeId: string;
  providerRoomId?: string; // Optional actual room identifier
  status?: string; // Checked-in, Clean, etc.
}

/**
 * RoomingRoomEntity - Mapirano na tabelu RoomingRoom.
 * Predstavlja konkretnu dodeljenu sobu u okviru rezervacije.
 */
export class RoomingRoomEntity {
  private constructor(private props: RoomingRoomProps) {}

  public static create(props: RoomingRoomProps): Result<RoomingRoomEntity, Error> {
    if (!props.roomingSetId || !props.roomTypeId) {
      return fail(new Error('RoomingSetId i RoomTypeId su obavezni.'));
    }
    return ok(new RoomingRoomEntity(props));
  }

  get id() { return this.props.id; }
  get roomTypeId() { return this.props.roomTypeId; }
  get providerRoomId() { return this.props.providerRoomId; }
  get status() { return this.props.status; }
}
