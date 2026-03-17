import { Result, ok, fail } from '../../core/error/Result';

export type ChildPricingMode = 'FREE' | 'PERCENT_DISCOUNT' | 'FIXED_AMOUNT' | 'ADULT_RATE' | 'EXTRA_BED_RATE';

export interface ChildPolicyProps {
  id?: string;
  ratePlanId: string;
  ageFrom: number;
  ageTo: number;
  pricingMode: ChildPricingMode;
  valueAmount?: number;
  valuePercent?: number;
  isSharingBed: boolean; // Važno za vašu logiku: da li dete deli ležaj ili ima svoj
}

/**
 * ChildPolicyEntity - Srce vaše logike za decu.
 * Mapirano na tabelu 4.7 rate_plan_child_policies.
 */
export class ChildPolicyEntity {
  private constructor(private props: ChildPolicyProps) {}

  public static create(props: ChildPolicyProps): Result<ChildPolicyEntity, Error> {
    if (props.ageFrom < 0 || props.ageTo < props.ageFrom) {
      return fail(new Error('Neispravan starosni opseg za dete.'));
    }
    return ok(new ChildPolicyEntity(props));
  }

  get ageRange() { return `${this.props.ageFrom}-${this.props.ageTo}`; }

  /**
   * Izračunava cenu za dete na osnovu osnovne cene odrasle osobe.
   */
  calculatePrice(baseAdultPrice: number): number {
    switch (this.props.pricingMode) {
      case 'FREE': return 0;
      case 'PERCENT_DISCOUNT': return baseAdultPrice * (1 - (this.props.valuePercent || 0) / 100);
      case 'FIXED_AMOUNT': return this.props.valueAmount || 0;
      case 'ADULT_RATE': return baseAdultPrice;
      default: return baseAdultPrice;
    }
  }
}
