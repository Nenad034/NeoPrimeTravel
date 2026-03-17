import { Result, ok, fail } from '../../core/error/Result';

/**
 * FiscalReceiptEntity - Mapirano na regulatory.fiscal_receipts.
 * Upravlja komunikacijom sa PFR-om.
 */
export interface FiscalReceiptProps {
  id?: string;
  bookingId: string;
  paymentId: string;
  receiptType: 'PR' | 'AP'; // Prodaja / Ispravka
  amount: number;
  currency: string;
  qrCodeData?: string;
  fiscalReference?: string;
  status: 'QUEUED' | 'ISSUED' | 'FAILED';
}

export class FiscalReceiptEntity {
  private constructor(private props: FiscalReceiptProps) {}

  public static create(props: FiscalReceiptProps): Result<FiscalReceiptEntity, Error> {
    if (props.amount <= 0) return fail(new Error('Iznos na fiskalnom računu mora biti veći od 0.'));
    return ok(new FiscalReceiptEntity(props));
  }

  get isIssued() { return this.props.status === 'ISSUED'; }
}
