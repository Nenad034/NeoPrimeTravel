/**
 * Unified Hotel Model (Master Entity)
 */
export interface MasterHotel {
  id: string;
  name: string;
  stars: number;
  destination: string;
}

/**
 * Normalizovana soba (NeoTravel Standard)
 */
export interface NormalizedRoom {
  masterCode: string;   // npr. "double_deluxe"
  displayName: string;  // npr. "Deluxe Dvokrevetna Soba"
  boardCode: string;    // npr. "ALL_INCLUSIVE"
}

/**
 * Raw data od dobavljača (neobrađen podatak)
 */
export interface RawSupplierOffer {
  supplierId: string;
  supplierHotelCode: string;
  roomName: string;     // npr. "DLX DBL"
  boardName: string;    // npr. "AI"
  netPrice: number;
  currency: string;
}

/**
 * NormalizationEngine
 * 
 * Implementira logiku iz Sekcije 13-16 dokumentacije Deo 7:
 * - Hotel Mapping (Master ID)
 * - Room Mapping (Normalizacija naziva)
 * - Board Mapping (Standardizacija ishrane)
 */
export class NormalizationEngine {

  // --- MOCK MAPPING BAZE (u realnosti se čitaju iz novih tabela) ---
  private static HOTEL_MAPPING: Record<string, string> = {
    "EXPEDIA:9981": "master-hotel-1201",
    "WEBBEDS:HT123": "master-hotel-1201",
    "DIRECT:SOLPL": "master-hotel-1201"
  };

  private static ROOM_MAPPING: Record<string, string> = {
    "DLX DBL": "double_deluxe",
    "Double Deluxe Room": "double_deluxe",
    "Standard": "standard"
  };

  private static BOARD_MAPPING: Record<string, string> = {
    "AI": "ALL_INCLUSIVE",
    "All Incl": "ALL_INCLUSIVE",
    "HB": "HALF_BOARD",
    "BB": "BED_BREAKFAST"
  };

  /**
   * Glavna metoda Normalizacije:
   * Pretvara sirovi odgovor dobavljača u naš Standardni format.
   */
  public static normalize(raw: RawSupplierOffer): { masterHotelId: string; room: NormalizedRoom; price: number } {
    console.log(`[Normalization] Obrađujem ponudu dobavljača ${raw.supplierId} za kod: ${raw.supplierHotelCode}...`);

    // 1. Hotel Mapping (Sekcija 13)
    const masterHotelId = this.HOTEL_MAPPING[`${raw.supplierId}:${raw.supplierHotelCode}`] || "unknown";

    // 2. Room Mapping (Sekcija 14)
    const masterRoomCode = this.ROOM_MAPPING[raw.roomName] || "standard";
    
    // 3. Board Mapping (Sekcija 15)
    const masterBoardCode = this.BOARD_MAPPING[raw.boardName] || "ROOM_ONLY";

    return {
      masterHotelId,
      room: {
        masterCode: masterRoomCode,
        displayName: this.humanizeRoomCode(masterRoomCode),
        boardCode: masterBoardCode
      },
      price: raw.netPrice
    };
  }

  private static humanizeRoomCode(code: string): string {
    return code.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
}
