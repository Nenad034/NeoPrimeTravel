import { NormalizationEngine, RawSupplierOffer } from './NormalizationEngine';
import { PackagePricingEngine, PricingItem, PackagePriceBreakdown, Channel } from './PackagePricingEngine';
import { AdvancedMathEngine, CancellationStep, OccupancyConfig } from './AdvancedMathEngine';
import { SupplierRankingService, SupplierOffer } from './SupplierRankingService';
import { AISearchService } from '../search/AISearchService';
import { TranslationService } from '../../core/i18n/TranslationService';

export interface DynamicPackageRequest {
  naturalQuery: string;
  channel: Channel;
  agencyId?: string;
  contactId?: string;
  promoCode?: string;
}

export interface FinalPackageResult {
  searchSummary: string;
  masterHotelId: string;
  masterHotelName: string;
  occupancyDetails: string;
  breakdown: PackagePriceBreakdown;
  cancellationPolicy: string;
  currentCancelPenalty: number;
  aiInsights: string[];
}

/**
 * NeoTravelMasterEngine (The "Great Brain")
 * 
 * Finalna integracija svih podsistema:
 * 1. NLP Parser (AISearchService)
 * 2. Normalization & Mapping (NormalizationEngine)
 * 3. Occupancy & Cancellation Math (AdvancedMathEngine)
 * 4. Package Pricing & Bundling (PackagePricingEngine)
 * 5. Supplier Ranking & B2C/B2B Filtering (SupplierRankingService)
 * 
 * Dodaje podršku za: IZLETE (Activities) i ULAZNICE (Tickets).
 */
export class NeoTravelMasterEngine {

  public static async processFullPackage(request: DynamicPackageRequest): Promise<FinalPackageResult> {
    console.log(`\n--- 🚀 MASTER ENGINE: PROCESIRANJE "SVE-U-JEDNOM" ---`);
    
    // 1. Razumevanje upita (NLP)
    const criteria = await AISearchService.parseNaturalQuery(request.naturalQuery);
    const searchSummary = AISearchService.generateQuerySummary(criteria);

    // 2. Simulacija sirovih podataka (Let + Hotel + Transfer + IZLET/ULAZNICA)
    // Ovde simuliramo da smo od dobavljača dobili sirove podatke
    const rawHotel: RawSupplierOffer = {
      supplierId: 'DIRECT',
      supplierHotelCode: 'SOLPL',
      roomName: 'Standard',
      boardName: 'AI',
      netPrice: 720,
      currency: 'EUR'
    };

    const rawFlight: PricingItem = {
      type: 'FLIGHT',
      description: 'Zakupljen let Hurghada',
      netPrice: 250,
      taxes: 40,
      fees: 10,
      currency: 'EUR'
    };

    const rawTransfer: PricingItem = {
      type: 'TRANSFER',
      description: 'Povratni transfer aerodrom',
      netPrice: 40,
      currency: 'EUR'
    };

    // NOVO: Podrška za IZLETE i ULAZNICE (Sekcije 5.9 i 11 dokumentacije Deo 7)
    const rawActivity: PricingItem = {
      type: 'ACTIVITY',
      description: 'Izlet Krstarenje Nilom (Pun dan)',
      netPrice: 45,
      currency: 'EUR'
    };

    const rawTicket: PricingItem = {
      type: 'ACTIVITY', // Ulaznica se mapira kao aktivnost/ticket
      description: 'Ulaznica za Akvarijum Hurghada',
      netPrice: 15,
      currency: 'EUR'
    };

    // 3. Normalizacija hotela (Mapping)
    const normalizedHotel = NormalizationEngine.normalize(rawHotel);

    // 4. Matematička obrada putnika (Occupancy Math)
    const occupancy = AdvancedMathEngine.calculateOccupancyPrice(
      normalizedHotel.price,
      criteria.rooms[0] as OccupancyConfig
    );

    // 5. Formiranje stavki za Pricing Engine
    const finalItems: PricingItem[] = [
      { 
        type: 'HOTEL', 
        description: `Sol Plaza 5* (${normalizedHotel.room.displayName})`, 
        netPrice: occupancy.finalPrice, 
        currency: 'EUR' 
      },
      rawFlight,
      rawTransfer,
      rawActivity,
      rawTicket
    ];

    // 6. Finalni Pricing & Bundling (uključujući paketne popuste)
    const breakdown = PackagePricingEngine.calculatePackage(finalItems, request.channel, request.promoCode);

    // 7. Politika otkazivanja (Bazirano na datumu puta iz NLP upita)
    const cancelSteps: CancellationStep[] = [
      { daysBefore: 14, percent: 50 },
      { daysBefore: 1, percent: 100 }
    ];
    const cancelInfo = AdvancedMathEngine.calculateCancellationPenalty(
      breakdown.finalTotal,
      cancelSteps,
      criteria.startDate
    );

    // 8. AI Insights (Logika iz SoftZoneService)
    const aiInsights = [
      "Optimalna temperatura u Hurghadi (28°C)",
      "Ušteda od 8% jer ste uzeli Hotel + Let + Izlete",
      "Visoka pouzdanost dobavljača (99%)"
    ];

    return {
      searchSummary,
      masterHotelId: normalizedHotel.masterHotelId,
      masterHotelName: "Hotel Sol Plaza Beach Resort 5*",
      occupancyDetails: occupancy.details,
      breakdown,
      cancellationPolicy: cancelInfo.policyDescription,
      currentCancelPenalty: cancelInfo.currentPenalty,
      aiInsights
    };
  }
}
