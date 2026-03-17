import { Result, ok, fail } from '../../core/error/Result';

export type TransferType = 'PRIVATE' | 'SHARED' | 'SHUTTLE' | 'PREMIUM';
export type VehicleTypeCode = 'SEDAN' | 'MINIVAN' | 'MINIBUS' | 'BUS';

export interface TransferProps {
  id?: string;
  productId: string;
  type: TransferType;
  vehicleType: VehicleTypeCode;
  maxPassengers: number;
  maxBags: number;
  pickupLocationCode: string; // npr. 'AYT' (Airport Antalija)
  dropoffLocationCode: string; // npr. 'BELEK_ZONE'
  sourcing: 'API' | 'MANUAL' | 'FLEET'; // 'FLEET' označava Internal Fleet (sopstvena vozila)
  fleetVehicleId?: string; // Veza ka internal floti ako je sourcing FLEET
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
}

/**
 * TransferEntity - Mapirano na logiku domena 3.10 iz dokumentacije.
 * Podržava eksterne partnere i Internal Fleet (sopstvena vozila).
 */
export class TransferEntity {
  private constructor(private props: TransferProps) {}

  public static create(props: TransferProps): Result<TransferEntity, Error> {
    if (props.maxPassengers < 1) {
      return fail(new Error('Kapacitet putnika mora biti najmanje 1.'));
    }

    if (props.sourcing === 'FLEET' && !props.fleetVehicleId) {
      return fail(new Error('Internal Fleet transfer mora biti povezan sa vozilom iz flote.'));
    }

    return ok(new TransferEntity(props));
  }

  get id() { return this.props.id; }
  get capacity() { return `${this.props.maxPassengers}pax / ${this.props.maxBags}bags`; }
  
  /**
   * Provera da li vozilo može da primi grupu putnika i prtljag.
   */
  canFit(passengers: number, bags: number): boolean {
    return passengers <= this.props.maxPassengers && bags <= this.props.maxBags;
  }
}
