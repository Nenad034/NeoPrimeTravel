import { Result, ok, fail } from '../../core/error/Result';

export type ProductType = 'HOTEL' | 'FLIGHT' | 'TRANSFER' | 'ACTIVITY' | 'CRUISE' | 'ADDON';
export type SourcingType = 'API' | 'MANUAL' | 'HYBRID';

/**
 * Base Product Interface - "Glava" svakog proizvoda u sistemu.
 * Definisano prema Master Blueprint-u (Deo 10) i Core ERD logici.
 */
export interface ProductProps {
  id?: string;
  externalId?: string; // ID od dobavljača (Expedia, Amadeus...)
  name: string;
  type: ProductType;
  sourcing: SourcingType;
  supplierId: string;
  destinationId: string;
  statusCode: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  baseCurrency: string;
  metadata?: Record<string, any>; // Za specifične tagove (npr. "Family favorite")
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Univerzalni Product Entitet.
 * Osigurava da svaki proizvod, bez obzira na tip, poštuje osnovna pravila sistema.
 */
export class ProductEntity {
  private constructor(private props: ProductProps) {}

  public static create(props: ProductProps): Result<ProductEntity, Error> {
    if (!props.name || props.name.length < 2) {
      return fail(new Error('Naziv proizvoda mora imati najmanje 2 karaktera.'));
    }

    // Konsultacija sa dokumentacijom: Provera sourcing tipa
    if (props.sourcing === 'API' && !props.externalId) {
      return fail(new Error('API proizvodi moraju imati eksterni ID dobavljača.'));
    }

    return ok(new ProductEntity({
      ...props,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date()
    }));
  }

  // Getteri za pristup podacima (Immutable)
  get id() { return this.props.id; }
  get type() { return this.props.type; }
  get sourcing() { return this.props.sourcing; }
  get name() { return this.props.name; }
  
  /**
   * Biznis pravilo: Da li je proizvod spreman za Dynamic Packaging?
   */
  canBePackaged(): boolean {
    return this.props.statusCode === 'ACTIVE';
  }
}
