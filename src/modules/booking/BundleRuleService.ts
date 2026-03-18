import { Result, ok, fail } from '../../core/error/Result';
import { BundleRuleEntity, BundleRuleProps, DiscountType } from './BundleRuleEntity';
import { supabase } from '../../api/v1/supabaseClient';

/**
 * BundleRuleService - Servis za upravljanje pravilima popusta.
 * Povezuje UI sa Supabase bazom podataka.
 */
export class BundleRuleService {
  private static rules: BundleRuleEntity[] = [];

  /**
   * Dohvata sva pravila iz baze podataka.
   */
  public static async fetchAllRules(): Promise<BundleRuleEntity[]> {
    try {
      const { data, error } = await supabase
        .from('bundle_rules')
        .select('*')
        .order('priority', { ascending: false });

      if (error) throw error;

      this.rules = (data || []).map(row => {
        const props: BundleRuleProps = {
          id: row.id.toString(),
          name: row.name,
          requiredItemTypes: row.types,
          discountType: row.discount_unit === 'PERCENT' ? 'PERCENTAGE' : 'FIXED_AMOUNT' as DiscountType,
          discountPercentage: row.discount_unit === 'PERCENT' ? row.discount_value : undefined,
          discountFixedAmount: row.discount_unit === 'FIXED' ? row.discount_value : undefined,
          isActive: true, // Pretpostavka za sada
          priority: row.priority,
          isAiSuggested: row.is_ai_generated,
          approvedBy: row.status === 'APPROVED' ? 'System' : undefined
        };
        const entity = BundleRuleEntity.create(props);
        return entity.isSuccess() ? entity.value : null;
      }).filter(r => r !== null) as BundleRuleEntity[];

      return this.rules;
    } catch (err) {
      console.error('[BundleRuleService] Fetch error:', err);
      return this.rules; // Fallback na in-memory ako baza ne radi
    }
  }

  /**
   * Registruje novo pravilo u bazu.
   */
  public static async saveRuleToDb(props: BundleRuleProps): Promise<Result<BundleRuleEntity, Error>> {
    try {
      const dbRow = {
        name: props.name,
        types: props.requiredItemTypes,
        discount_value: props.discountType === 'PERCENTAGE' ? props.discountPercentage : props.discountFixedAmount,
        discount_unit: props.discountType === 'PERCENTAGE' ? 'PERCENT' : 'FIXED',
        priority: props.priority,
        status: props.approvedBy ? 'APPROVED' : 'PENDING',
        is_ai_generated: props.isAiSuggested || false
      };

      const { data, error } = await supabase
        .from('bundle_rules')
        .insert([dbRow])
        .select();

      if (error) throw error;

      const entity = BundleRuleEntity.create({ ...props, id: data[0].id.toString() });
      if (entity.isSuccess()) {
        this.rules.push(entity.value);
        return ok(entity.value);
      }
      return fail(entity.error);
    } catch (err: any) {
      return fail(new Error(err.message));
    }
  }

  /**
   * Dohvata sva aktivna i odobrena pravila (koristi se u DPE engine-u).
   */
  public static getActiveRules(): BundleRuleEntity[] {
    return this.rules
      .filter(r => r.isActive && r.isApproved)
      .sort((a, b) => b.priority - a.priority);
  }

  /**
   * Čovek (Korisnik) odobrava pravilo (Ažurira status u bazi).
   */
  public static async approveRule(ruleId: string, userName: string): Promise<Result<BundleRuleEntity, Error>> {
    try {
      const { error } = await supabase
        .from('bundle_rules')
        .update({ status: 'APPROVED' })
        .eq('id', ruleId);

      if (error) throw error;

      // Osveži lokalnu listu
      await this.fetchAllRules();
      return ok(this.rules.find(r => r.id === ruleId)!);
    } catch (err: any) {
      return fail(new Error(err.message));
    }
  }

  /**
   * Inicijalizacija osnovnih pravila (samo za demo).
   */
  public static seedInitialRules(): void {
    // Ovde možemo pozvati fetchAllRules pri pokretanju aplikacije
    this.fetchAllRules();
  }
}
