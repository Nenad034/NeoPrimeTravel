import { Result, ok, fail } from '../../core/error/Result';

export type ImageType = 'HERO' | 'GALLERY' | 'ROOM' | 'FACILITY' | 'MAP';

export interface HotelImageProps {
  id?: string;
  productId: string;
  url: string;
  type: ImageType;
  isPrimary: boolean;
  sortOrder: number;
  altText?: string;
}

/**
 * HotelMediaEntity - Upravljanje vizuelnim identitetom hotela.
 * Mapirano na tabelu 3.7 product_images iz dokumentacije.
 */
export class HotelImageEntity {
  private constructor(private props: HotelImageProps) {}

  public static create(props: HotelImageProps): Result<HotelImageEntity, Error> {
    if (!props.url) return fail(new Error('URL slike je obavezan.'));
    return ok(new HotelImageEntity(props));
  }

  get url() { return this.props.url; }
  get isHero() { return this.props.type === 'HERO' || this.props.isPrimary; }
}

export interface AmenityProps {
  id: string;
  code: string;
  name: string;
  groupCode: 'ROOM' | 'HOTEL' | 'DINING' | 'WELLNESS' | 'BEACH' | 'TRANSPORT';
}

/**
 * HotelAmenityEntity - Sadržaji hotela.
 * Mapirano na tabelu 3.8 product_amenities iz dokumentacije.
 */
export class HotelAmenityEntity {
  constructor(public props: AmenityProps) {}
}
