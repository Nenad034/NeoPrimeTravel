/**
 * San TSG (Paximum / TourVisio) API Klijent
 * 
 * Ovaj fajl predstavlja početnu infrastrukturu za povezivanje vaše platforme
 * sa Filip Travel / Big Blue sistemima koji rade ispod San TSG softvera.
 */

interface SanTsgConfig {
  baseUrl: string; // Endpoint dobijen od Filipa/Big Blue-a (npr. Paximum ili wsdl Tourvisio)
  agency: string;
  user: string;
  password?: string;
  token?: string; // Moderni Paximum koristi Bearer / API Tokene
}

interface SearchCriteria {
  destinationId: string; // Njihov interni ID destinacije (Ovo ćete morati da mapirate)
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  occupancies: Array<{ adults: number, childrenAges: number[] }>;
}

export class SanTsgClient {
  private config: SanTsgConfig;

  constructor(config: SanTsgConfig) {
    this.config = config;
  }

  /**
   * 1. Autentifikacija
   * Metoda koja dobavlja privremeni Token. Ukoliko koristite Paximum, token traje ograničeno vreme.
   */
  async authenticate(): Promise<string> {
    console.log(`[SanTsgClient] Inicijalizacija autentifikacije za agenciju: ${this.config.agency}...`);
    
    // TODO: Zameniti ovde pravim Axios/Fetch pozivom prema Auth Endpointu koji Vam pošalju u dokumentaciji.
    // Primer kako to obično izgleda (Paximum stil):
    /*
    const response = await fetch(`${this.config.baseUrl}/Api/Authenticate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Agency: this.config.agency, User: this.config.user, Password: this.config.password })
    });
    const data = await response.json();
    this.config.token = data.Token;
    return data.Token;
    */
    
    return "MOCK_SAN_TSG_TOKEN_123";
  }

  /**
   * 2. Pretraga Paketa / Hotela
   * Metoda sa kojom "gađate" sistem (npr. Filip Travel) kako biste prosledili datume i dobili live cene.
   */
  async searchAvailability(criteria: SearchCriteria): Promise<any[]> {
    if (!this.config.token) {
        await this.authenticate();
    }

    console.log(`[SanTsgClient] Slanje upita za datume: ${criteria.checkIn} do ${criteria.checkOut}`);
    console.log(`[SanTsgClient] Pretraga destinacije TSG_ID: ${criteria.destinationId}`);

    // TODO: Parsovanje kriterijuma u njihov specifičan JSON payload (Paximum uobičajeno) ili izrada čistog SOAP XML bodija (za klasični TourVisio).
    
    // MOCK RESPONSE
    // Simuliramo šta će zapravo San TSG vratiti pre nego što to presložimo u naš NeoTravel standard.
    const mockApiResponse = [
      {
         hotelId: "STSG-HTL-101",
         hotelName: "Pegasos World - Filip Travel B2B Block",
         starRating: 5,
         priceInfo: {
            amount: 1450.00,
            currency: "EUR"
         },
         flights: [
            { airline: "Air Serbia (Charter)", code: "JU 244", from: "BEG", to: "AYT" }
         ]
      }
    ];

    // Ovdje integrirate Mapper funkciju koja prevodi njihov JSON unutar NeoTravel interfejsa
    return this.mapResponseToNeoTravel(mockApiResponse);
  }

  /**
   * 3. Mapiranje (Translator)
   * Klasičan korak. Oni šalju objekte na svoj način (npr. priceInfo), Vi na Vaš:
   */
  private mapResponseToNeoTravel(sanTsgData: any[]): any[] {
     return sanTsgData.map(item => ({
        id: item.hotelId,
        name: item.hotelName,
        rating: item.starRating,
        price: item.priceInfo.amount,
        // itd...
     }));
  }
}
