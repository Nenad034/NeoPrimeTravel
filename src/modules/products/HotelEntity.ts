import { Result, ok, fail } from '../../core/error/Result';

export interface HotelProps {
  id?: string;
  productId: string; // Veza ka product.products
  stars: number;
  cityName: string;
  countryCode: string;
  latitude?: number;
  longitude?: number;
  checkInTime?: string;
  checkOutTime?: string;
  hotelChainName?: string;
  statusCode: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  descriptionHtml?: string;
  amenities?: string[]; // Code list
  images?: string[]; // IDs or URLs of primary images
}

/**
 * HotelEntity - Mapirano na tabelu product.hotels iz SQL-a.
 * Predstavlja fizički objekat hotela sa svim njegovim atributima.
 */
export class HotelEntity {
  private constructor(private props: HotelProps) {}

  public static create(props: HotelProps): Result<HotelEntity, Error> {
    if (props.stars < 0 || props.stars > 5) {
      return fail(new Error('Kategorizacija (zvezdice) mora biti između 0 i 5.'));
    }

    if (!props.cityName || !props.countryCode) {
      return fail(new Error('Grad i država su obavezni podaci za hotel.'));
    }

    return ok(new HotelEntity(props));
  }

  // Getteri (Immutable pristup)
  get id() { return this.props.id; }
  get stars() { return this.props.stars; }
  get location() { return `${this.props.cityName}, ${this.props.countryCode}`; }
  get coordinates() { 
    return (this.props.latitude && this.props.longitude) 
      ? { lat: this.props.latitude, lng: this.props.longitude } 
      : null; 
  }
}
