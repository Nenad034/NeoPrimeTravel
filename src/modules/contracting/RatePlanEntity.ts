import { Result, ok, fail } from '../../core/error/Result';

/**
 * RatePlanEntity - Mapirano na tabelu 4.5 rate_plans.
 * Razdvaja različite prodajne uslove (npr. 'Early Bird', 'Standard', 'Last Minute').
 */
export interface RatePlanProps {
  id?: string;
  contractVersionId: string;
  ratePlanCode: string; // npr. 'EB_10', 'STD_BB'
  name: string;
  pricingBasis: 'PER_ROOM' | 'PER_PERSON' | 'OCCUPANCY_BASED';
  cancellationPolicy: 'REFUNDABLE' | 'NON_REFUNDABLE' | 'PARTIAL';
  allotmentPoolId?: string; // Veza ka specifičnom kapacitetu (Pravilo o 5 soba za cenovnik A)
  inclusions: string[]; // Šta je uračunato u cenu
}

export class RatePlanEntity {
  constructor(public props: RatePlanProps) {}

  public static create(props: RatePlanProps): Result<RatePlanEntity, Error> {
    if (!props.ratePlanCode) return fail(new Error('Rate plan code je obavezan.'));
    return ok(new RatePlanEntity(props));
  }
}

/**
 * DayRate - Rezultat dnevne kalkulacije cene.
 */
export interface DayRate {
  date: Date;
  netPrice: number;
  discountApplied: number; // Popust koji važi baš za taj dan
  isDiscountValid: boolean;
}
