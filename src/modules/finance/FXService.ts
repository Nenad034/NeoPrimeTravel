import axios from 'axios';

/**
 * FXService - Servis za upravljanje deviznim kursevima.
 * U primarnom modu povlači podatke sa NBS (National Bank of Serbia).
 */
export class FXService {
  private static NBS_API_URL = 'https://portal.nbs.rs/api/kursna-lista'; // Primer URL-a

  /**
   * Dohvata srednji kurs NBS za određenu valutu na današnji dan.
   */
  public static async getMiddleRate(currencyCode: string): Promise<number> {
    console.log(`[FXService] Dohvatam kurs za ${currencyCode} sa NBS portala...`);
    
    try {
      // U produkciji ovde ide stvarni axios poziv
      // const response = await axios.get(`${this.NBS_API_URL}?currency=${currencyCode}`);
      
      // Simulacija NBS odgovora (Mock)
      const mockRates: Record<string, number> = {
        'EUR': 117.05,
        'USD': 110.20,
        'GBP': 136.50
      };
      
      return mockRates[currencyCode] || 1.0;
    } catch (error) {
      console.warn(`[FXService] Problem sa dohvatanjem kursa, koristim fallback (117.00)`);
      return 117.00;
    }
  }

  /**
   * Računa iznos u lokalnoj valuti (RSD) na osnovu unetog kursa.
   */
  public static convertToLocal(amount: number, rate: number): number {
    return Math.round(amount * rate * 100) / 100;
  }
}
