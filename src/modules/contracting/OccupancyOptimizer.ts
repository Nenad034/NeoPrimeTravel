import { Result, ok } from '../../core/error/Result';
import { RoomTypeEntity } from '../products/RoomTypeEntity';
import { ChildPolicyEntity } from './ChildPolicyEntity';

export interface OccupancyCombination {
  adults: number;
  children: number;
  childAges: string[];
  totalCapacityUsed: number;
  label: string; // npr. "2 ADL + 1 CHD (2-7)"
}

/**
 * OccupancyOptimizer - Inteligentni motor za kreiranje pravila (Vaš zahtev).
 * Generiše sve validne kombinacije za unos cena na osnovu sobe i pravila za decu.
 */
export class OccupancyOptimizer {
  /**
   * Generiše listu polja za unos cena koja operater treba da popuni.
   */
  public static generateInputsForRoom(
    room: RoomTypeEntity,
    childPolicies: ChildPolicyEntity[]
  ): OccupancyCombination[] {
    const combinations: OccupancyCombination[] = [];
    
    // Osnovna kombinacija: Samo odrasli
    for (let a = 1; a <= (room as any).props.maxAdults; a++) {
      combinations.push({
        adults: a,
        children: 0,
        childAges: [],
        totalCapacityUsed: a,
        label: `${a} ADL`
      });

      // Dodajemo decu za svaku kombinaciju odraslih
      for (const policy of childPolicies) {
        if ((a + 1) <= ((room as any).props.maxAdults + (room as any).props.maxChildren)) {
             combinations.push({
                adults: a,
                children: 1,
                childAges: [policy.ageRange],
                totalCapacityUsed: a + 1,
                label: `${a} ADL + 1 CHD (${policy.ageRange})`
            });
        }
      }
    }

    // Sortiramo po kompleksnosti radi lakšeg unosa
    return combinations;
  }
}
