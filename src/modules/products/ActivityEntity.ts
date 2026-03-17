import { Result, ok, fail } from '../../core/error/Result';

export type ActivityCategory = 'CITY_TOUR' | 'MUSEUM' | 'THEME_PARK' | 'BOAT_TRIP' | 'EXCURSION' | 'ADVENTURE';

export interface ActivityProps {
  id?: string;
  productId: string;
  category: ActivityCategory;
  name: string;
  durationMinutes: number;
  meetingPointText: string;
  meetingPointLat?: number;
  meetingPointLng?: number;
  isTicketed: boolean; // Da li generiše ulaznicu sa QR kodom (npr. Disneyland)
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
}

/**
 * ActivityEntity - Mapirano na logiku domena 3.11 iz dokumentacije.
 * Upravlja izletima, turama i ulaznicama.
 */
export class ActivityEntity {
  private constructor(private props: ActivityProps) {}

  public static create(props: ActivityProps): Result<ActivityEntity, Error> {
    if (!props.name || props.name.length < 3) {
      return fail(new Error('Naziv aktivnosti mora imati najmanje 3 karaktera.'));
    }

    if (props.durationMinutes <= 0) {
      return fail(new Error('Trajanje aktivnosti mora biti pozitivna vrednost.'));
    }

    return ok(new ActivityEntity(props));
  }

  get id() { return this.props.id; }
  get durationHours() { return (this.props.durationMinutes / 60).toFixed(1); }
  
  /**
   * Da li je potrebna potvrda od lokalnog provajdera?
   */
  requiresManualConfirmation(): boolean {
    return !this.props.isTicketed; // Ulaznice (ticketing) su obično instant.
  }
}
