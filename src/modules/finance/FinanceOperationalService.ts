import { BookingEntity } from '../booking/BookingEntity';
import { FXService } from './FXService';
import { TranslationService } from '../../core/i18n/TranslationService';

export interface MarginReport {
  cisCode: string;
  customerName: string;
  totalSellRsd: number;
  totalNetRsd: number;
  grossMarginRsd: number;
  vatAmountRsd: number; // PDV po Članu 35
  netMarginRsd: number;  // Profit nakon poreza
  labels: {
    sellPrice: string;
    netPrice: string;
    grossMargin: string;
    vatAmount: string;
    netProfit: string;
  }
}

/**
 * FinanceOperationalService - Generator finansijskih izveštaja.
 * Implementira logiku Člana 35 i yield analitiku.
 */
export class FinanceOperationalService {
  /**
   * Generiše obračun PDV-a na maržu (Član 35) za konkretni dosije.
   */
  public static async calculateMarginReport(
    booking: BookingEntity,
    netPriceValuta: number,
    manualRate?: number
  ): Promise<MarginReport> {
    const rate = manualRate || await FXService.getMiddleRate('EUR'); 
    
    // 1. Preračun u lokalnu valutu (RSD)
    const sellRsd = FXService.convertToLocal(booking.totalPrice, rate);
    const netRsd = FXService.convertToLocal(netPriceValuta, rate);
    
    // 2. Obračun Bruto Marže
    const grossMargin = sellRsd - netRsd;
    
    // 3. Obračun PDV-a (Unutrašnja stopa 20/120)
    let vatAmount = 0;
    if (grossMargin > 0) {
      vatAmount = Math.round((grossMargin - (grossMargin / 1.20)) * 100) / 100;
    }
    
    const netMargin = grossMargin - vatAmount;

    return {
      cisCode: booking.cisCode,
      customerName: booking.booker.name,
      totalSellRsd: sellRsd,
      totalNetRsd: netRsd,
      grossMarginRsd: grossMargin,
      vatAmountRsd: vatAmount,
      netMarginRsd: netMargin,
      labels: {
        sellPrice: TranslationService.translate('finance.sell_price'),
        netPrice: TranslationService.translate('finance.net_price'),
        grossMargin: TranslationService.translate('finance.gross_margin'),
        vatAmount: TranslationService.translate('finance.vat_amount'),
        netProfit: TranslationService.translate('finance.net_profit')
      }
    };
  }
}

