import { Result, ok, fail } from '../../core/error/Result';

/**
 * CisTripEntity - Mapirano na regulatory.cis_trips (eTurista / CIS).
 * Upravlja prijavom putnika državnim organima.
 */
export interface CisTripProps {
  id?: string;
  bookingId: string;
  tripReference: string;
  submissionStatus: 'DRAFT' | 'SUBMITTED' | 'ACCEPTED' | 'REJECTED';
}

export class CisTripEntity {
  private constructor(private props: CisTripProps) {}

  public static create(props: CisTripProps): Result<CisTripEntity, Error> {
    if (!props.tripReference) return fail(new Error('Referenca putovanja je obavezna za CIS prijavu.'));
    return ok(new CisTripEntity(props));
  }
}
