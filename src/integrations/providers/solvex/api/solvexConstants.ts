/**
 * Solvex API Constants and Mappings
 */

export const SOLVEX_SOAP_METHODS = {
    AUTHENTICATE: 'Connect',
    SEARCH_HOTELS: 'SearchHotelServices',
    CHECK_CONNECTION: 'CheckConnect',
    GET_COUNTRIES: 'GetCountries',
    GET_CITIES: 'GetCities',
    GET_HOTELS: 'GetHotels',
    GET_CANCELLATION_POLICY: 'GetCancellationPolicyInfoWithPenalty'
} as const;

export const SOLVEX_NAMESPACE = 'http://www.megatec.ru/';

export const SOLVEX_RESPONSE_PATHS = {
    HOTEL_SERVICES: 'HotelServices',
    DATA_REQUEST_RESULT: 'DataRequestResult',
    RESULT_TABLE: 'ResultTable',
    DIFFGRAM: 'diffgram',
    DOCUMENT_ELEMENT: 'DocumentElement'
} as const;

export const SOLVEX_FIELD_MAPPING = {
    'HotelKey': 'id',
    'HotelName': 'name',
    'CityKey': 'cityId',
    'CityName': 'cityName',
    'CountryKey': 'countryId',
    'RtKey': 'roomTypeId',
    'RtCode': 'roomTypeCode',
    'RcKey': 'roomCategoryId',
    'RcName': 'roomCategoryName',
    'AcKey': 'accommodationId',
    'AcName': 'accommodationName',
    'TotalCost': 'totalPrice',
    'QuoteType': 'availabilityStatus',
    'PnKey': 'mealPlanId',
    'PnCode': 'mealPlanCode',
    'PnName': 'mealPlanName'
} as const;
