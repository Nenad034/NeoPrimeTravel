import { BookingEntity } from '../booking/BookingEntity';
import { TranslationService } from '../../core/i18n/TranslationService';

export interface IntelligenceSignal {
  type: 'WEATHER' | 'SENTIMENT' | 'LOGISTICS' | 'MARKET';
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  message: string;
  actionSuggestion: string;
}

/**
 * SoftZoneService - Inteligentni sloj platforme (Meka Zona).
 * Nadgleda spoljne faktore i unutrašnji sentiment kako bi pružio uvid DossierDirector-u.
 */
export class SoftZoneService {
  
  /**
   * Analizira destinaciju i termin putovanja za potencijalne rizike ili prilike.
   */
  public static async analyzeDestinationIntel(destination: string, startDate: Date): Promise<IntelligenceSignal[]> {
    console.log(`[SoftZone] Analiziram inteligenciju za destinaciju: ${destination}...`);
    const signals: IntelligenceSignal[] = [];

    // 1. Weather Logic (Simulacija)
    const month = startDate.getMonth();
    if (month >= 5 && month <= 7 && destination.toLowerCase().includes('egipat')) {
      signals.push({
        type: 'WEATHER',
        severity: 'HIGH',
        message: TranslationService.translate('signals.weather_heat_wave'),
        actionSuggestion: TranslationService.translate('signals.weather_heat_wave_suggestion')
      });
    }

    return signals;
  }

  /**
   * Analizira beleške agenta ili komunikaciju klijenta (Sentiment Analysis).
   */
  public static analyzeSentiment(text: string): IntelligenceSignal | null {
    const t = text.toLowerCase();
    
    if (t.includes('problem') || t.includes('čekam') || t.includes('nezadovoljan')) {
      return {
        type: 'SENTIMENT',
        severity: 'HIGH',
        message: TranslationService.translate('signals.sentiment_negative'),
        actionSuggestion: TranslationService.translate('signals.sentiment_negative_suggestion')
      };
    }
    
    return null;
  }

  /**
   * Cross-Product Bundling - Prepoznaje šta fali u dosijeu.
   */
  public static suggestBundling(booking: BookingEntity, items: any[]): IntelligenceSignal[] {
    const suggestions: IntelligenceSignal[] = [];
    const hasTransfer = items.some(item => item.type === 'TRANSPORT');
    
    if (!hasTransfer) {
      suggestions.push({
        type: 'LOGISTICS',
        severity: 'MEDIUM',
        message: TranslationService.translate('signals.logistics_no_transfer'),
        actionSuggestion: TranslationService.translate('signals.logistics_no_transfer_suggestion')
      });
    }

    return suggestions;
  }
}

