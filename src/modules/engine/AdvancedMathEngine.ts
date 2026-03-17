export interface CancellationStep {
  daysBefore: number;   // Broj dana pre puta (npr. 14)
  percent: number;      // Procenat penala (npr. 30)
  fixedFee?: number;    // Fiksni trošak (ako postoji)
}

export interface OccupancyConfig {
  adults: number;
  children: number;
  childAges: number[];
}

export interface OccupancyPriceResult {
  basePrice: number;
  supplements: number;
  discounts: number;
  finalPrice: number;
  details: string;
}

/**
 * AdvancedMathEngine
 * 
 * Implementira logiku iz Sekcije 11 (Occupancy) i 21 (Cancellation) dokumentacije Deo 6.
 * Odgovoran za precizne obračune dece i penala otkazivanja.
 */
export class AdvancedMathEngine {

  /**
   * Izračunava cenu na osnovu tipa sobe i sastava putnika (Sekcija 11.1)
   */
  public static calculateOccupancyPrice(
    baseRoomPrice: number, // Cena za 1/2 sobu (po osobi ili po sobi, ovde uzimamo PO SOBI za 2 odraslih)
    config: OccupancyConfig
  ): OccupancyPriceResult {
    let supplements = 0;
    let discounts = 0;
    let details = `${config.adults} odraslih`;

    // 1. Doplata za 3. odraslu osobu (Sekcija 11.1: 3rd adult supplement)
    if (config.adults > 2) {
      const extraAdults = config.adults - 2;
      const supplementPerAdult = baseRoomPrice * 0.40; // Tipična doplata 40%
      supplements += extraAdults * supplementPerAdult;
      details += `, ${extraAdults} dodatne odrasle osobe`;
    }

    // 2. Dečiji popusti na osnovu uzrasta (Sekcija 11.1: child discount)
    config.childAges.forEach((age, index) => {
      if (age < 2) {
        // Infant: Besplatno ili minimalna doplata
        discounts += 0; 
        details += `, Infant (${age} god)`;
      } else if (age < 12) {
        // Prvo dete 2-12 god obično ima popust (npr. 50% ako je sa dvoje odraslih)
        const childPrice = (baseRoomPrice / 2) * 0.50; 
        supplements += childPrice;
        details += `, Dete ${index + 1} (${age} god)`;
      } else {
        // Deca preko 12 se računaju kao odrasli
        supplements += (baseRoomPrice / 2) * 0.80;
        details += `, Dete ${index + 1} (${age} god - adult rate)`;
      }
    });

    const finalPrice = baseRoomPrice + supplements - discounts;

    return {
      basePrice: baseRoomPrice,
      supplements,
      discounts,
      finalPrice,
      details: `Sastav: ${details}`
    };
  }

  /**
   * Generiše politiku otkazivanja i računa trenutni penal (Sekcija 8.2 & 21.1)
   */
  public static calculateCancellationPenalty(
    totalPrice: number,
    steps: CancellationStep[],
    travelStartDate: Date,
    currentDate: Date = new Date()
  ): { currentPenalty: number, policyDescription: string, isNonRefundable: boolean } {
    
    // Razlika u danima
    const diffTime = travelStartDate.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let currentPenaltyPercent = 0;
    let policyTextParts: string[] = [];

    // Sortiramo stepenice penalizacije (najbliže putu prvo)
    const sortedSteps = [...steps].sort((a, b) => a.daysBefore - b.daysBefore);

    sortedSteps.forEach(step => {
      policyTextParts.push(`${step.daysBefore} dana pre puta: ${step.percent}% penala`);
      if (diffDays <= step.daysBefore) {
        currentPenaltyPercent = Math.max(currentPenaltyPercent, step.percent);
      }
    });

    const currentPenalty = (totalPrice * currentPenaltyPercent) / 100;
    const isNonRefundable = currentPenaltyPercent === 100;

    return {
      currentPenalty,
      policyDescription: policyTextParts.length > 0 ? policyTextParts.join('; ') : 'Besplatno otkazivanje',
      isNonRefundable
    };
  }
}
