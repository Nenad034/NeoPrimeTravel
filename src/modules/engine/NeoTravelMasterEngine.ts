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

export interface StructuredPackageRequest {
  destinationCode: string;
  startDate: Date;
  endDate: Date;
  adults: number;
  children: number;
  childAges: number[];
  channel: Channel;
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
  criteria: any; // Original search parameters
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
    console.log(`\n--- 🚀 MASTER ENGINE: PROCESIRANJE "SVE-U-JEDNOM" (NLP) ---`);
    const criteria = await AISearchService.parseNaturalQuery(request.naturalQuery);
    return this.executeSearch(criteria, request.channel, request.promoCode);
  }

  /**
   * KLASIČNA (STRUKTURIRANA) PRETRAGA
   * Koristi se kada agent ručno bira destinaciju, datume i putnike iz dropdown-a.
   */
  public static async processStructuredPackage(request: StructuredPackageRequest): Promise<FinalPackageResult> {
    console.log(`\n--- 🏢 MASTER ENGINE: PROCESIRANJE "SVE-U-JEDNOM" (KLASIČNA) ---`);
    
    const criteria = {
      destinationCode: request.destinationCode,
      startDate: request.startDate,
      endDate: request.endDate,
      rooms: [{ 
        adults: request.adults, 
        children: request.children, 
        childAges: request.childAges 
      }],
      aiPrompt: "Classic structured search"
    };

    return this.executeSearch(criteria, request.channel, request.promoCode);
  }

  /**
   * Zajednička logika izvršavanja pretrage i kalkulacije paketa.
   */
  private static async executeSearch(criteria: any, channel: Channel, promoCode?: string): Promise<FinalPackageResult> {
    const searchSummary = AISearchService.generateQuerySummary(criteria);

    // 1. Simulacija sirovih podataka (Ovo bi išlo preko API konektora u realnosti)
    const rawHotel: RawSupplierOffer = {
      supplierId: 'DIRECT',
      supplierHotelCode: 'SOLPL',
      roomName: 'Standard',
      boardName: 'AI',
      netPrice: 720,
      currency: 'EUR'
    };

    const rawFlight: PricingItem = { type: 'FLIGHT', description: 'Zakupljen let Hurghada', netPrice: 250, taxes: 40, fees: 10, currency: 'EUR' };
    const rawTransfer: PricingItem = { type: 'TRANSFER', description: 'Povratni transfer aerodrom', netPrice: 40, currency: 'EUR' };
    const rawActivity: PricingItem = { type: 'ACTIVITY', description: 'Izlet Krstarenje Nilom', netPrice: 45, currency: 'EUR' };
    const rawTicket: PricingItem = { type: 'ACTIVITY', description: 'Ulaznica za Akvarijum', netPrice: 15, currency: 'EUR' };

    // 2. Normalizacija i Matematička obrada
    const normalizedHotel = NormalizationEngine.normalize(rawHotel);
    const occupancy = AdvancedMathEngine.calculateOccupancyPrice(normalizedHotel.price, criteria.rooms[0]);

    // 3. Formiranje stavki i Cena
    const finalItems: PricingItem[] = [
      { type: 'HOTEL', description: `Sol Plaza 5* (${normalizedHotel.room.displayName})`, netPrice: occupancy.finalPrice, currency: 'EUR' },
      rawFlight, rawTransfer, rawActivity, rawTicket
    ];

    const breakdown = PackagePricingEngine.calculatePackage(finalItems, channel, promoCode);

    // 4. Politika otkazivanja
    const cancelSteps: CancellationStep[] = [{ daysBefore: 14, percent: 50 }, { daysBefore: 1, percent: 100 }];
    const cancelInfo = AdvancedMathEngine.calculateCancellationPenalty(breakdown.finalTotal, cancelSteps, criteria.startDate);

    return {
      searchSummary,
      masterHotelId: normalizedHotel.masterHotelId,
      masterHotelName: "Hotel Sol Plaza Beach Resort 5*",
      occupancyDetails: occupancy.details,
      breakdown,
      cancellationPolicy: cancelInfo.policyDescription,
      currentCancelPenalty: cancelInfo.currentPenalty,
      aiInsights: [
        "Optimalna temperatura (28°C)",
        "Ušteda od 8% na bundle popust",
        "Pouzdanost 99%"
      ],
      criteria
    };
  }
}
