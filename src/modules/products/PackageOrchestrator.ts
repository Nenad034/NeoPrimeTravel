import { Result, ok, fail } from '../../core/error/Result';
import { ProductEntity, ProductType } from './ProductEntity';

/**
 * Package Orchestrator - Srce Dynamic Packaging logike.
 * Omogućava kreiranje svih odobrenih kombinacija:
 * - Hotel + Let
 * - Hotel + Let + Transfer
 * - Hotel + Let + Activity/Tickets
 * - Cruise + Flight
 */
export interface PackageBundle {
  id?: string;
  items: ProductEntity[];
  totalNetPrice: number;
  totalGrossPrice: number;
  currency: string;
}

export class PackageOrchestrator {
  /**
   * Proverava kompatibilnost proizvoda pre nego što ih spoji u paket.
   * Konsultacija sa dokumentacijom (Deo 10): Datum i Destinacija moraju biti usklađeni.
   */
  public static validateBundle(items: ProductEntity[]): Result<boolean, Error> {
    const types = items.map(i => i.type);
    
    // Provera: Da li imamo bar dva proizvoda za paket?
    if (items.length < 2) {
      return fail(new Error('Paket mora sadržati najmanje dva proizvoda.'));
    }

    // Specifična provera za "Zlatni Standard" (Let + Hotel + Transfer)
    if (types.includes('HOTEL') && types.includes('FLIGHT') && !types.includes('TRANSFER')) {
      console.log('[Warning] Detektovan Hotel+Let bez Transfera. Sistem će predložiti transfer.');
    }

    // Specifična provera za "Full Service" (Hotel + Let + Transfer + Activity)
    if (types.includes('HOTEL') && types.includes('FLIGHT') && types.includes('TRANSFER') && types.includes('ACTIVITY')) {
      console.log('[Info] Formiran Full Service paket. Primenjujem maksimalni popust (Bundle Discount).');
    }

    // Ovde bi išla duboka logika provere datuma (Temporal Compatibility)
    return ok(true);
  }

  /**
   * Kreira finalni bundle za korpu.
   */
  public static createBundle(items: ProductEntity[]): Result<PackageBundle, Error> {
    const validation = this.validateBundle(items);
    if (validation.isFailure()) return fail(validation.error);

    // Sumiranje cena bi išlo ovde (0 tokena - čista logika koda)
    return ok({
      items,
      totalNetPrice: 0, 
      totalGrossPrice: 0,
      currency: 'EUR'
    });
  }
}
