import { makeSoapRequest } from './solvexSoapClient';
import type { SolvexApiResponse } from '../types/solvex.types';

const getEnvVar = (key: string) => {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key] !== undefined) {
        // @ts-ignore
        return import.meta.env[key];
    }
    return undefined;
};

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;
const TOKEN_LIFETIME = 30 * 60 * 1000; 

export async function connect(): Promise<SolvexApiResponse<string>> {
    try {
        if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
            return { success: true, data: cachedToken };
        }

        const login = getEnvVar('VITE_SOLVEX_LOGIN');
        const password = getEnvVar('VITE_SOLVEX_PASSWORD');

        if (!login || !password) {
            throw new Error('VITE_SOLVEX_LOGIN ili PASSWORD nisu definisani u .env');
        }

        console.log('[Solvex Auth] Requesting new token...');

        const result = await makeSoapRequest<string>('Connect', {
            'login': login,
            'password': password
        });

        if (!result || result.includes('Connection result code:')) {
            throw new Error(`Solvex API Auth Error: ${result}`);
        }

        cachedToken = result;
        tokenExpiry = Date.now() + TOKEN_LIFETIME;

        return { success: true, data: result };
    } catch (error) {
        console.error('[Solvex Auth] Connection failed:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to connect to Solvex API'
        };
    }
}

export default { connect };
