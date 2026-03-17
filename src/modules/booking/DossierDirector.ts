import { BookingEntity } from '../booking/BookingEntity';
import { FinanceOperationalService } from '../finance/FinanceOperationalService';
import { OperationalService } from '../operations/OperationalService';
import { RegulatoryService } from '../regulatory/RegulatoryService';
import { SoftZoneService, IntelligenceSignal } from '../ai/SoftZoneService';

/**
 * DossierDirector - Vrhovni dirigent sistema.
 * Spaja Enterprise workflow stabilnost sa NeoTravel AI inteligencijom.
 */
export class DossierDirector {
  
  /**
   * Glavna metoda za procesiranje bilo koje promene u dosijeu (Dossier Processing Loop).
   */
  public async processDossierChange(booking: BookingEntity): Promise<IntelligenceSignal[]> {
    console.log(`[DossierDirector] Analiziram promene za Dossier: ${booking.cisCode}`);
    let allSignals: IntelligenceSignal[] = [];

    // 1. ENTERPRISE REFLEX: Validacija Integriteta
    if (booking.status === 'CONFIRMED' && booking.totalPrice <= 0) {
      throw new Error(`[Director Audit] Kritična greška: Status je CONFIRMED ali cena je 0.`);
    }

    // 2. SOFT ZONE AI: Inteligentna Analiza (Uključivanje Meke Zone)
    const destinationIntel = await SoftZoneService.analyzeDestinationIntel('Egipat', new Date(2026, 6, 15));
    allSignals = [...allSignals, ...destinationIntel];

    // Simulacija analize beleške (Sentiment)
    const sentimentSignal = SoftZoneService.analyzeSentiment("Klijent se žali da predugo čeka na potvrdu sobe");
    if (sentimentSignal) allSignals.push(sentimentSignal);

    // 3. REGULATORY REFLEX: Automatsko okidanje države
    if (booking.status === 'CONFIRMED') {
      await this.handleConfirmedWorkflow(booking);
    }

    return allSignals;
  }

  /**
   * Workflow koji se pokreće kada se potvrdi rezervacija.
   */
  private async handleConfirmedWorkflow(booking: BookingEntity): Promise<void> {
    console.log(`[Director Workflow] Pokrećem "Confirmation Chain" za ${booking.cisCode}`);
    
    await RegulatoryService.registerCisTrip({
      cisCode: booking.cisCode,
      destination: 'Egipat',
      startDate: new Date(),
      endDate: new Date()
    });
  }
}
