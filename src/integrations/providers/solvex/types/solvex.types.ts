// Solvex API Types

export interface SolvexAuthResponse {
    connectResult: string; // GUID token
}

export interface SolvexHotelSearchParams {
    guid: string;
    dateFrom: string; // YYYY-MM-DD
    dateTo: string;
    cityId?: number | number[];
    hotelId?: number | number[];
    adults: number;
    children?: number;
    childrenAges?: number[];
    rooms?: number;
    tariffId?: number; 
    tariffs?: number[];
}

export interface SolvexHotel {
    id: number;
    name: string;
    nameLat: string;
    city: {
        id: number;
        name: string;
        nameLat: string;
    };
    country: {
        id: number;
        name: string;
        nameLat: string;
    };
    starRating: number;
    priceType: number; 
}

export interface SolvexRoom {
    roomType: {
        id: number;
        name: string;
        nameLat: string;
        places: number;
        exPlaces: number;
    };
    roomCategory: {
        id: number;
        name: string;
        nameLat: string;
    };
    roomAccommodation: {
        id: number;
        name: string;
        nameLat: string;
        adultMainPlaces: number;
        childMainPlaces: number;
    };
}

export interface SolvexPansion {
    id: number;
    name: string;
    nameLat: string;
    code: string;
}

export interface SolvexHotelSearchResult {
    hotel: SolvexHotel;
    room: SolvexRoom;
    pansion: SolvexPansion;
    totalCost: number; 
    addHotsWithCosts?: number; 
    quotaType: number; 
    tariff: {
        id: number;
        name: string;
    };
    cancellationPolicyRequestParams?: any; 
    duration: number;
    startDate: string;
}

export interface SolvexApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface SolvexCancellationPolicy {
    policyKey: number;
    dateFrom: string | null;
    dateTo: string | null;
    penaltyValue: number;
    isPercent: boolean; 
    totalPenalty: number;
    description: string;
}
