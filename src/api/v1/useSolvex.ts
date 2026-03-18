import { useState } from 'react';
import { searchHotels } from '../../integrations/providers/solvex/api/solvexSearchService';
import type { SolvexHotelSearchResult } from '../../integrations/providers/solvex/types/solvex.types';

export const useSolvex = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSolvexHotels = async (params: {
        destination: string;
        checkIn: string;
        checkOut: string;
        adults: number;
    }) => {
        setLoading(true);
        setError(null);
        try {
            // Solvex uses numeric City IDs. For this demo, let's map some common ones or fallback.
            // Bansko = 9, Sunny Beach = 68, Golden Sands = 33
            let cityId: number | undefined = undefined;
            const dest = params.destination.toLowerCase();
            if (dest.includes('bansko')) cityId = 9;
            if (dest.includes('sunny beach') || dest.includes('sunčev breg')) cityId = 68;
            if (dest.includes('golden sands') || dest.includes('zlatni pjasci')) cityId = 33;

            const response = await searchHotels({
                dateFrom: params.checkIn,
                dateTo: params.checkOut,
                adults: params.adults,
                cityId: cityId || 33 // Default to Golden Sands if not sure
            });

            if (response.success && response.data) {
                return response.data.map(item => ({
                    id: `solvex-${item.hotel.id}-${item.room.roomType.id}`,
                    type: 'Accommodation',
                    name: item.hotel.name,
                    location: `${item.hotel.city.name}, ${item.hotel.country.name}`,
                    price: item.totalCost,
                    rating: item.hotel.starRating,
                    tags: ['Partner Rate', item.pansion.name],
                    aiSummary: `Specijalna ponuda preko Solvex-a. ${item.room.roomType.name} - ${item.pansion.name}.`,
                    prediction: item.quotaType === 1 ? 'Instant confirmation' : 'On Request',
                    icon: 'Building2', // We'll map this in the UI
                    provider: 'Solvex'
                }));
            } else {
                setError(response.error || 'Failed to fetch Solvex hotels');
                return [];
            }
        } catch (err: any) {
            setError(err.message);
            return [];
        } finally {
            setLoading(false);
        }
    };

    return { fetchSolvexHotels, loading, error };
};
