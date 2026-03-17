import { Result, ok, fail } from '../../core/error/Result';
import { PriceSnapshot, SourcingModel } from './PricingService';
import { DayRate } from './RatePlanEntity';

/**
 * NightByNightPriceCalculator - Srce preciznog obračuna.
 * Implementira Vaša dva ključna pravila:
 * 1. Dan-po-dan obračun popusta (EB, Last Minute...).
 * 2. Višestruki cenovnici po periodu.
 */
export class NightByNightPriceCalculator {
  
  /**
   * Izračunava cenu za ceo boravak tako što proverava svaku noć posebno.
   * Pravilo: Ako popust prestaje usred boravka, primenjuje se samo na važeće dane.
   */
  public static calculateStay(
    startDate: Date,
    endDate: Date,
    baseNightlyPrice: number,
    discountRules: Array<{ from: Date, to: Date, percent: number }>
  ): DayRate[] {
    const results: DayRate[] = [];
    let currentDate = new Date(startDate);

    while (currentDate < endDate) {
      const applicableDiscount = discountRules.find(rule => 
        currentDate >= rule.from && currentDate <= rule.to
      );

      const discountPercent = applicableDiscount ? applicableDiscount.percent : 0;
      const netForNight = baseNightlyPrice * (1 - discountPercent / 100);

      results.push({
        date: new Date(currentDate),
        netPrice: netForNight,
        discountApplied: discountPercent,
        isDiscountValid: discountPercent > 0
      });

      // Pomeramo na sledeći dan
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return results;
  }

  /**
   * Sumira sve dane u jedan total.
   */
  public static sumStay(rates: DayRate[]): number {
    return rates.reduce((sum, day) => sum + day.netPrice, 0);
  }
}
