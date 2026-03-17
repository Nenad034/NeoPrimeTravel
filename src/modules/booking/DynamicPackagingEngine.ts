import { BookingItemEntity } from './BookingItemEntity';
import { Result, ok, fail } from '../../core/error/Result';
import { BundleRuleService } from './BundleRuleService';

export interface PackageValidationResult {
  isValid: boolean;
  errors: string[];
  suggestions: string[];
}

/**
 * DynamicPackagingEngine (DPE) - Mozak za kreiranje i validaciju paketa.
 * Odgovoran za sinhronizaciju letova, hotela i transfera.
 */
export class DynamicPackagingEngine {
  
  /**
   * Validira kompatibilnost više stavki unutar jednog paketa.
   */
  public static validatePackage(items: BookingItemEntity[]): PackageValidationResult {
    const errors: string[] = [];
    const suggestions: string[] = [];

    const hotels = items.filter(i => i.type === 'HOTEL' || i.type === 'ACCOMMODATION');
    const flights = items.filter(i => i.type === 'FLIGHT');
    const transfers = items.filter(i => i.type === 'TRANSFER');

    // 1. Temporalna validacija (Let vs Hotel)
    if (flights.length > 0 && hotels.length > 0) {
      // Ovde će ići kompleksna logika proveravanja satnica sletanja i check-ina
      // Za sada implementiramo osnovnu proveru datuma
    }

    // 2. Provera "Missing Links" (Logika za Guardian Angel)
    if (hotels.length > 0 && flights.length > 0 && transfers.length === 0) {
      suggestions.push("Dosije nema rezervisan transfer. Sugestija: Dodati privatni transfer do hotela.");
    }

    return {
      isValid: errors.length === 0,
      errors,
      suggestions
    };
  }

  /**
   * Izračunava optimizovanu cenu paketa na osnovu ODOBRENIH korisničkih pravila.
   */
  public static calculateBundlePrice(items: { price: number, type: string }[]): number {
    const basePrice = items.reduce((sum, item) => sum + item.price, 0);
    const itemTypes = items.map(i => i.type);
    
    // Uzimamo sva aktivna i odobrena pravila
    const rules = BundleRuleService.getActiveRules();
    let totalDiscount = 0;

    // Primenjujemo pravila po prioritetu
    for (const rule of rules) {
      if (rule.matches(itemTypes)) {
        totalDiscount += rule.calculateDiscount(basePrice);
        // Ako pravilo nije kumulativno, ovde bismo mogli staviti break;
        // Za sada dozvoljavamo više popusta ako se pravila poklapaju
      }
    }
    
    return Math.max(0, basePrice - totalDiscount);
  }
}
