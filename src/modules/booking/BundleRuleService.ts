import { Result, ok, fail } from '../../core/error/Result';
import { BundleRuleEntity, BundleRuleProps } from './BundleRuleEntity';

/**
 * BundleRuleService - Servis za upravljanje pravilima popusta.
 * Omogućava ručno kreiranje i AI sugestije pravila.
 */
export class BundleRuleService {
  private static rules: BundleRuleEntity[] = [];

  /**
   * Registruje novo pravilo.
   */
  public static saveRule(rule: BundleRuleEntity): void {
    // U realnom sistemu ovde ide upis u bazu preko Prisme
    this.rules = [...this.rules.filter(r => r.id !== rule.id), rule];
    console.log(`[BundleRuleService] Pravilo '${rule.name}' je sačuvano.`);
  }

  /**
   * Dohvata sva aktivna i odobrena pravila.
   */
  public static getActiveRules(): BundleRuleEntity[] {
    return this.rules
      .filter(r => r.isActive && r.isApproved)
      .sort((a, b) => b.priority - a.priority);
  }

  /**
   * AI Agent: Predlaže novo pravilo na osnovu analize tržišta ili istorije.
   * Pravilo: Uvek je isAiSuggested = true i NIJE odobreno dok čovek ne klikne.
   */
  public static suggestAiRule(context: string): BundleRuleEntity {
    console.log(`[AI Agent] Analiziram kontekst: ${context}`);
    
    // Simulacija AI analize
    const suggestedProps: BundleRuleProps = {
      id: `AI-${Date.now()}`,
      name: "Smart Summer Bundle (AI Suggestion)",
      description: "Automatski uočen trend: Povećana potražnja za kombinacijom Hotel + Let za Egipat.",
      requiredItemTypes: ['HOTEL', 'FLIGHT'],
      discountType: 'PERCENTAGE',
      discountPercentage: 7,
      isActive: true,
      priority: 10,
      isAiSuggested: true
    };

    const result = BundleRuleEntity.create(suggestedProps);
    if (result.isFailure()) throw result.error;
    return result.value;
  }

  /**
   * Čovek (Korisnik) odobrava pravilo.
   */
  public static approveRule(ruleId: string, userName: string): Result<BundleRuleEntity, Error> {
    const rule = this.rules.find(r => r.id === ruleId);
    if (!rule) return fail(new Error("Pravilo nije pronađeno."));

    // Kreiramo novi entitet sa podacima o odobrenju
    const approvedProps = {
      ...(rule as any).props,
      approvedBy: userName,
      approvedAt: new Date()
    };

    const approvedRule = BundleRuleEntity.create(approvedProps);
    if (approvedRule.isSuccess()) {
      this.saveRule(approvedRule.value);
      return ok(approvedRule.value);
    }
    return fail(approvedRule.error);
  }

  /**
   * Inicijalizacija osnovnih pravila (samo za demo, u produkciji se vuče iz baze).
   */
  public static seedInitialRules(): void {
    const result = BundleRuleEntity.create({
      id: 'rule-master-1',
      name: 'Standard Package Discount',
      requiredItemTypes: ['HOTEL', 'FLIGHT', 'TRANSFER'],
      discountType: 'PERCENTAGE',
      discountPercentage: 5,
      isActive: true,
      priority: 1,
      approvedBy: 'Admin',
      approvedAt: new Date()
    });

    if (result.isSuccess()) {
      this.saveRule(result.value);
    }
  }
}
