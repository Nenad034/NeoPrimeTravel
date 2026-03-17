import { Result, ok, fail } from '../../core/error/Result';

export type DiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT' | 'HYBRID';

export interface BundleRuleProps {
  id?: string;
  name: string;
  description?: string;
  requiredItemTypes: string[]; // npr. ['FLIGHT', 'HOTEL', 'TRANSFER']
  discountType: DiscountType;
  discountPercentage?: number;
  discountFixedAmount?: number;
  isActive: boolean;
  priority: number; // Veći broj = veći prioritet
  isAiSuggested?: boolean;
  approvedBy?: string;
  approvedAt?: Date;
}

/**
 * BundleRuleEntity - Entitet za definisanje pravila popusta na pakete.
 * Prema Ground Rules: Korisnik mora eksplicitno odobriti ili kreirati ovo pravilo.
 */
export class BundleRuleEntity {
  private constructor(private props: BundleRuleProps) {}

  public static create(props: BundleRuleProps): Result<BundleRuleEntity, Error> {
    if (props.discountType === 'PERCENTAGE' && (props.discountPercentage === undefined || props.discountPercentage < 0)) {
      return fail(new Error('Procenat popusta mora biti definisan i pozitivan.'));
    }
    if (props.discountType === 'FIXED_AMOUNT' && (props.discountFixedAmount === undefined || props.discountFixedAmount < 0)) {
      return fail(new Error('Fiksni iznos popusta mora biti definisan i pozitivan.'));
    }
    if (props.discountType === 'HYBRID' && (props.discountPercentage === undefined || props.discountFixedAmount === undefined)) {
      return fail(new Error('Hibridni popust zahteva definisan i procenat i fiksni iznos.'));
    }
    if (props.requiredItemTypes.length === 0) {
      return fail(new Error('Pravilo mora sadržati bar jedan tip usluge.'));
    }

    return ok(new BundleRuleEntity({
      ...props,
      isAiSuggested: props.isAiSuggested ?? false
    }));
  }

  get id() { return this.props.id; }
  get name() { return this.props.name; }
  get isActive() { return this.props.isActive; }
  get isApproved() { return !!this.props.approvedBy; }
  get requiredTypes() { return [...this.props.requiredItemTypes]; }
  get priority() { return this.props.priority; }

  /**
   * Proverava da li se pravilo može primeniti na listu tipova usluga.
   */
  matches(itemTypes: string[]): boolean {
    if (!this.props.isActive || !this.isApproved) return false;
    
    // Provera da li su svi zahtevani tipovi prisutni u korpi
    const upperItemTypes = itemTypes.map(t => t.toUpperCase());
    return this.props.requiredItemTypes.every(req => upperItemTypes.includes(req.toUpperCase()));
  }

  /**
   * Izračunava popust na osnovu bazne cene.
   */
  calculateDiscount(basePrice: number): number {
    let discount = 0;
    
    if (this.props.discountType === 'PERCENTAGE' || this.props.discountType === 'HYBRID') {
      discount += basePrice * ((this.props.discountPercentage || 0) / 100);
    }
    
    if (this.props.discountType === 'FIXED_AMOUNT' || this.props.discountType === 'HYBRID') {
      discount += (this.props.discountFixedAmount || 0);
    }
    
    return discount;
  }
}
