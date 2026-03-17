import { Result, ok, fail } from '../../core/error/Result';

export interface FleetVehicleProps {
  id?: string;
  registrationNumber: string; // Registarska tablica (npr. BG-1234-XX)
  make: string; // Brend (npr. Mercedes, Setra)
  model: string;
  yearOfManufacture: number;
  capacityPax: number;
  capacityBags: number;
  ownerAgencyId: string; // Vaša agencija (Internal Fleet)
  driverId?: string; // Trenutno zaduženi vozač (iam.users)
  status: 'AVAILABLE' | 'MAINTENANCE' | 'ON_TRIP' | 'OUT_OF_SERVICE';
}

/**
 * FleetVehicleEntity - Upravljanje sopstvenim voznim parkom (Internal Fleet).
 * Omogućava praćenje sopstvenih buseva, minibusa i automobila.
 */
export class FleetVehicleEntity {
  private constructor(private props: FleetVehicleProps) {}

  public static create(props: FleetVehicleProps): Result<FleetVehicleEntity, Error> {
    if (!props.registrationNumber) {
      return fail(new Error('Registarski broj je obavezan za vozilo u floti.'));
    }

    if (props.capacityPax < 1) {
      return fail(new Error('Vozilo mora imati kapacitet od bar jednog putnika.'));
    }

    return ok(new FleetVehicleEntity(props));
  }

  get id() { return this.props.id; }
  get fullModelName() { return `${this.props.make} ${this.props.model}`; }
  
  /**
   * Da li je vozilo trenutno operativno?
   */
  isAvailable(): boolean {
    return this.props.status === 'AVAILABLE';
  }
}
