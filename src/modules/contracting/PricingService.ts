import { Result, ok, fail } from '../../core/error/Result';

export type SourcingModel = 'API' | 'MANUAL' | 'HYBRID';

export interface PriceSnapshot {
  ratePlanId: string;
  ratePlanName: string;
  netAmount: number;
  grossAmount: number;
  currency: string;
  source: SourcingModel;
  dayBreakdown: any[]; // Za dan-po-dan prikaz
}

/**
 * PricingService - Upravlja kalkulacijama za sve izvore.
 * Implementira Pravilo: API, Manual, Hybrid.
 */
export class PricingService {
  /**
   * Glavna metoda za dobijanje dostupnih ponuda.
   * Pravilo: Vraća listu SVIH važećih cenovnika, ne samo najjeftiniji.
   */
  async getAvailableOffers(
    productId: string,
    searchParams: any,
    model: SourcingModel
  ): Promise<Result<PriceSnapshot[], Error>> {
    
    if (model === 'API') {
      return this.fetchApiOffers(productId, searchParams);
    }

    if (model === 'MANUAL') {
      return this.calculateManualOffers(productId, searchParams);
    }

    if (model === 'HYBRID') {
      // Logika: Uzmi API cene, ali proveri da li postoji Manual Override
      const apiResult = await this.fetchApiOffers(productId, searchParams);
      if (apiResult.isFailure()) return apiResult;

      const manualOverrides = await this.checkManualOverrides(productId, searchParams);
      
      // Ako imamo manualne cene, one imaju prioritet u hibridnom modelu
      return manualOverrides.length > 0 ? ok(manualOverrides) : apiResult;
    }

    return fail(new Error('Nepodržan sourcing model za cene.'));
  }

  private async fetchApiOffers(id: string, params: any): Promise<Result<PriceSnapshot[], Error>> {
    // Simulacija API poziva (Expedia, Amadeus...)
    return ok([{ 
      ratePlanId: 'API_STD',
      ratePlanName: 'API Standard',
      netAmount: 100, 
      grossAmount: 120, 
      currency: 'EUR', 
      source: 'API',
      dayBreakdown: [] 
    }]);
  }

  private async calculateManualOffers(id: string, params: any): Promise<Result<PriceSnapshot[], Error>> {
    // Simulacija čitanja iz vaših tabela (Manual Entry)
    return ok([{ 
      ratePlanId: 'MAN_PROMO',
      ratePlanName: 'Moja Specijalna Ponuda',
      netAmount: 90, 
      grossAmount: 110, 
      currency: 'EUR', 
      source: 'MANUAL',
      dayBreakdown: [] 
    }]);
  }

  private async checkManualOverrides(id: string, params: any): Promise<PriceSnapshot[]> {
    // Provera da li ste vi ručno fiksirali cenu za neki termin
    return [];
  }
}
