import { useState, useCallback } from 'react';
import { TravelgateXApi, HotelSearchCriteria } from './TravelgateXApi';

export interface SearchResult {
  id: string;
  type: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  tags: string[];
  aiSummary: string;
  prediction: string;
  icon: string | React.ReactNode;
}

export const useTravelgateX = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHotels = useCallback(async (criteria: HotelSearchCriteria) => {
    setLoading(true);
    setError(null);

    try {
      const result = await TravelgateXApi.searchHotels(criteria);
      
      if (!result || result.errors) {
        throw new Error(result?.errors?.[0]?.description || 'Failed to fetch availability');
      }

      // Transform TravelgateX options to NeoTravel SearchResult format
      const transformedResults: SearchResult[] = result.options.map((opt: any) => ({
        id: opt.hotelCode,
        type: 'Accommodation',
        name: opt.hotelName,
        location: 'Search Location', // Could be mapped from criteria
        price: opt.price.gross,
        rating: 4.5, // Placeholder rating
        tags: [opt.boardCode, opt.paymentType].filter(Boolean),
        aiSummary: `Preporuka na osnovu ${opt.boardCode} usluge.`,
        prediction: 'Member Deal',
        icon: null // Will be handled in UI
      }));

      return transformedResults;

    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchHotels, loading, error };
};
