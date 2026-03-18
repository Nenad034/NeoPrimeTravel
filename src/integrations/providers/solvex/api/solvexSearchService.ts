import { makeSoapRequest, formatSolvexDate } from './solvexSoapClient';
import type {
    SolvexHotelSearchResult,
    SolvexHotelSearchParams,
    SolvexApiResponse
} from '../types/solvex.types';
import { connect } from './solvexAuthService';
import { SOLVEX_SOAP_METHODS, SOLVEX_RESPONSE_PATHS } from './solvexConstants';

export async function searchHotels(
    params: Omit<SolvexHotelSearchParams, 'guid'>,
    signal?: AbortSignal
): Promise<SolvexApiResponse<SolvexHotelSearchResult[]>> {
    try {
        const auth = await connect();
        if (!auth.success || !auth.data) {
            return { success: false, error: auth.error };
        }

        const request: any = {
            'PageSize': 500,
            'RowIndexFrom': 0,
            'DateFrom': formatSolvexDate(params.dateFrom || new Date()),
            'DateTo': formatSolvexDate(params.dateTo || new Date()),
            'Pax': params.adults + (params.children || 0),
            'Tariffs': { 'int': params.tariffs || [0, 1993] },
            'ResultView': 1,
            'Mode': 0,
            'QuotaTypes': { 'int': [0, 1] }
        };

        if (params.cityId) {
            const ids = Array.isArray(params.cityId) ? params.cityId : [params.cityId];
            request['CityKeys'] = { 'int': ids };
        }

        if (params.hotelId) {
            const ids = Array.isArray(params.hotelId) ? params.hotelId : [params.hotelId];
            request['HotelKeys'] = { 'int': ids };
        }

        if (params.childrenAges && params.childrenAges.length > 0) {
            request['Ages'] = { 'int': params.childrenAges };
        }

        const soapParams = { 'guid': auth.data, 'request': request };
        const result = await makeSoapRequest<any>(SOLVEX_SOAP_METHODS.SEARCH_HOTELS, soapParams, signal);

        let items: any[] = [];
        if (result?.Data?.[SOLVEX_RESPONSE_PATHS.DATA_REQUEST_RESULT]) {
            const dr = result.Data[SOLVEX_RESPONSE_PATHS.DATA_REQUEST_RESULT];
            const dataTable = Array.isArray(dr) ? dr[0] : dr;
            const diffgram = dataTable[SOLVEX_RESPONSE_PATHS.RESULT_TABLE]?.[SOLVEX_RESPONSE_PATHS.DIFFGRAM];
            const docElement = diffgram?.[SOLVEX_RESPONSE_PATHS.DOCUMENT_ELEMENT];

            if (docElement?.[SOLVEX_RESPONSE_PATHS.HOTEL_SERVICES]) {
                const hotelServices = docElement[SOLVEX_RESPONSE_PATHS.HOTEL_SERVICES];
                items = Array.isArray(hotelServices) ? hotelServices : [hotelServices];
            }
        }

        if (items.length === 0) return { success: true, data: [] };

        const mappedResults: SolvexHotelSearchResult[] = items.map(s => ({
            hotel: {
                id: parseInt(String(s.HotelKey || '0')),
                name: String(s.HotelName || 'Unknown Hotel'),
                nameLat: String(s.HotelName || 'Unknown Hotel'),
                city: {
                    id: parseInt(String(s.CityKey || '0')),
                    name: String(s.CityName || ''),
                    nameLat: String(s.CityName || '')
                },
                country: {
                    id: parseInt(String(s.CountryKey || '0')),
                    name: 'Bulgaria',
                    nameLat: 'Bulgaria'
                },
                starRating: s.StarRating || 0,
                priceType: 0
            },
            room: {
                roomType: {
                    id: parseInt(String(s.RtKey || '0')),
                    name: String(s.RoomTypeName || s.RtName || ''),
                    nameLat: String(s.RoomTypeName || s.RtName || ''),
                    places: 0,
                    exPlaces: 0
                },
                roomCategory: {
                    id: parseInt(String(s.RcKey || '0')),
                    name: String(s.RoomCategoryName || s.RcName || ''),
                    nameLat: String(s.RoomCategoryName || s.RcName || '')
                },
                roomAccommodation: {
                    id: parseInt(String(s.AcKey || '0')),
                    name: String(s.RoomAccommodationName || s.AcName || ''),
                    nameLat: String(s.RoomAccommodationName || s.AcName || ''),
                    adultMainPlaces: 0,
                    childMainPlaces: 0
                }
            },
            pansion: {
                id: parseInt(String(s.PnKey || '0')),
                name: String(s.PansionName || s.PnName || ''),
                nameLat: String(s.PansionName || s.PnName || ''),
                code: String(s.PnCode || '')
            },
            totalCost: parseFloat(String(s.TotalCost || '0')),
            quotaType: parseInt(String(s.QuoteType || '0')),
            tariff: {
                id: parseInt(String(s.TariffId || '0')),
                name: String(s.TariffName || '')
            },
            duration: Math.ceil((new Date(params.dateTo).getTime() - new Date(params.dateFrom).getTime()) / (1000 * 60 * 60 * 24)),
            startDate: params.dateFrom
        }));

        return { success: true, data: mappedResults };
    } catch (error) {
        console.error('[Solvex Search] searchHotels failed:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to perform hotel search'
        };
    }
}

export default { searchHotels };
