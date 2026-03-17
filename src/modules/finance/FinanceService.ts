import { Result, ok, fail } from '../../core/error/Result';
import { PaymentEntity } from './PaymentEntity';
import { RegulatoryService } from '../regulatory/RegulatoryService';

/**
 * FinanceService - Upravlja uplatama i pokreće fiskalizaciju.
 */
export class FinanceService {
  private regulatoryService = new RegulatoryService();

  /**
   * Registruje uplatu korisnika.
   * Pravilo: Odmah nakon potvrde pokreće fiskalizaciju (Pravilo 4.1).
   */
  async registerPayment(payment: PaymentEntity): Promise<Result<string, Error>> {
    console.log(`[Finance] Registrujem uplatu od ${payment.amount} za booking ${payment.bookingId}`);
    
    // 1. Snimanje u bazu (simulacija)
    
    // 2. Automatsko pokretanje fiskalizacije
    const fiscalResult = await this.regulatoryService.processFiscalization(
      payment.id || 'NEW',
      payment.amount,
      payment.bookingId
    );

    if (fiscalResult.isFailure()) {
        console.error(`[Finance] Greška kod fiskalizacije: ${fiscalResult.error.message}`);
        return fail(fiscalResult.error);
    }

    return ok('PAYMENT_AND_FISCAL_SUCCESS');
  }
}
