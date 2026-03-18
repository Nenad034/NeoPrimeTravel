// Solvex SOAP Client Utility (NeoTravel Edition)
import { XMLParser, XMLBuilder } from 'fast-xml-parser';

const getEnvVar = (key: string, fallback: string) => {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
        // @ts-ignore
        return import.meta.env[key];
    }
    return fallback;
};

// Use the Vite proxy from config
const SOLVEX_API_URL = '/api/solvex';

// XML Parser options
const parserOptions = {
    ignoreAttributes: true,
    attributeNamePrefix: '@_',
    textNodeName: '#text',
    parseAttributeValue: true,
    trimValues: true,
    removeNSPrefix: true 
};

const parser = new XMLParser(parserOptions);

const builderOptions = {
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    format: true,
    indentBy: '  ',
    suppressEmptyNode: true,
    suppressBooleanAttributes: false
};

const builder = new XMLBuilder(builderOptions);

export function buildSoapEnvelope(method: string, params: Record<string, any>): string {
    const envelope = {
        '?xml': { '@_version': '1.0', '@_encoding': 'utf-8' },
        'soap:Envelope': {
            '@_xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/',
            '@_xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
            '@_xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
            'soap:Body': {
                [method]: {
                    '@_xmlns': 'http://www.megatec.ru/',
                    ...params
                }
            }
        }
    };
    return builder.build(envelope);
}

function cleanAttributes(obj: any): any {
    if (obj === null || obj === undefined) return obj;
    if (Array.isArray(obj)) return obj.map(item => cleanAttributes(item));
    if (typeof obj === 'object') {
        const cleaned: any = {};
        for (const key in obj) {
            if (key === '#text') return obj[key];
            const targetKey = key.startsWith('@_') ? key.substring(2) : key;
            if (targetKey.includes(':') || targetKey === 'xmlns' || targetKey.startsWith('xsi:')) continue;
            cleaned[targetKey] = cleanAttributes(obj[key]);
        }
        return cleaned;
    }
    return obj;
}

export function parseSoapResponse<T>(xmlResponse: string): T {
    const parsed = parser.parse(xmlResponse);
    const envelope = parsed.Envelope;
    if (!envelope) throw new Error('No SOAP Envelope found');
    const body = envelope.Body;
    if (!body) throw new Error('No SOAP Body found');
    if (body.Fault) throw new Error(`SOAP Fault: ${body.Fault.faultstring || 'Unknown Error'}`);

    const responseKey = Object.keys(body).find(key => key.includes('Response'));
    if (!responseKey) return cleanAttributes(body) as T;

    const response = body[responseKey];
    const resultKey = Object.keys(response).find(key => key.includes('Result'));
    return cleanAttributes(resultKey ? response[resultKey] : response) as T;
}

export async function makeSoapRequest<T>(
    method: string,
    params: Record<string, any>,
    signal?: AbortSignal
): Promise<T> {
    const soapEnvelope = buildSoapEnvelope(method, params);
    const isDebug = getEnvVar('VITE_SOLVEX_DEBUG', 'false') === 'true';

    try {
        const response = await fetch(SOLVEX_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/xml; charset=utf-8',
                'SOAPAction': `"http://www.megatec.ru/${method}"`
            },
            body: soapEnvelope,
            signal
        });

        const xmlText = await response.text();
        if (response.ok) {
            if (isDebug) console.log(`[Solvex SOAP] Success: ${method}`);
            return parseSoapResponse<T>(xmlText);
        }
        throw new Error(`Solvex Error (${response.status}): ${response.statusText}`);
    } catch (error) {
        console.error(`[Solvex SOAP] Error in ${method}:`, error);
        throw error;
    }
}

export function formatSolvexDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export default { makeSoapRequest, formatSolvexDate };
