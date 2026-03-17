export const currencyManager = {
    EUR: 117.2,
    USD: 108.5,
    GBP: 136.2,
    RSD: 1.0,
    
    formatCurrency: (amount: number, currency: string) => {
        return new Intl.NumberFormat('sr-RS', {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: 2
        }).format(amount);
    },
    
    formatRsd: (amount: number) => {
        return new Intl.NumberFormat('sr-RS', {
            style: 'decimal',
            maximumFractionDigits: 0
        }).format(amount) + ' RSD';
    }
};
