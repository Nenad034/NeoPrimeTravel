/**
 * TravelgateX Hotel-X GraphQL API Service
 * Handles core hotel search, availability, and booking queries.
 */

const TGX_ENDPOINT = 'https://api.travelgate.com';

export interface PaxInput {
  age: number;
}

export interface OccupancyInput {
  pax: PaxInput[];
}

export interface HotelSearchCriteria {
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  hotels?: string[];
  destinations?: string[];
  occupancies: OccupancyInput[];
  nationality?: string;
  currency?: string;
  language?: string;
}

const HOTEL_SEARCH_QUERY = `
  query search($criteria: HotelSearchCriteriaInput!, $settings: HotelSettingsInput) {
    hotelX {
      search(criteria: $criteria, settings: $settings) {
        options {
          id
          status
          hotelCode
          hotelName
          boardCode
          paymentType
          price {
            currency
            net
            gross
          }
          rooms {
            code
            description
            occupancyRefId
          }
        }
        errors {
          code
          type
          description
        }
      }
    }
  }
`;

export class TravelgateXApi {
  private static apiKey: string = ''; // Should be loaded from env in production

  static setApiKey(key: string) {
    this.apiKey = key;
  }

  /**
   * Performs a hotel search across multiple suppliers.
   */
  static async searchHotels(criteria: HotelSearchCriteria, testMode: boolean = true) {
    if (!this.apiKey) {
      console.warn('TravelgateX API Key not set. Using mock results for preview.');
      return null;
    }

    const payload = {
      query: HOTEL_SEARCH_QUERY,
      variables: {
        criteria,
        settings: {
          testMode,
          timeout: 25000,
          context: 'B2B'
        }
      }
    };

    try {
      const response = await fetch(TGX_ENDPOINT, {
        method: 'POST',
        headers: {
          'Authorization': `Apikey ${this.apiKey}`,
          'Content-Type': 'application/json',
          'Accept-Encoding': 'gzip'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`TGX API Error: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data?.hotelX?.search;
    } catch (error) {
      console.error('TravelgateX search failed:', error);
      throw error;
    }
  }
}
