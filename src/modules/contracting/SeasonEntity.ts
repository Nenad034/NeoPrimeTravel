import { Result, ok, fail } from '../../core/error/Result';

/**
 * SeasonEntity - Mapirano na tabelu 4.4 contracting_seasons.
 * Upravlja vremenskim periodima za različite cenovnike.
 */
export interface SeasonProps {
  id?: string;
  contractVersionId: string;
  seasonCode: string;
  name: string;
  startDate: Date;
  endDate: Date;
  priority: number; // Veći prioritet "pobeđuje" ako se datumi preklapaju
}

export class SeasonEntity {
  private constructor(private props: SeasonProps) {}

  public static create(props: SeasonProps): Result<SeasonEntity, Error> {
    if (props.startDate >= props.endDate) {
      return fail(new Error('Početni datum sezone mora biti pre krajnjeg datuma.'));
    }
    return ok(new SeasonEntity(props));
  }

  get id() { return this.props.id; }
  get code() { return this.props.seasonCode; }
  
  /**
   * Provera da li određeni datum pripada ovoj sezoni.
   */
  includesDate(date: Date): boolean {
    return date >= this.props.startDate && date <= this.props.endDate;
  }
}
