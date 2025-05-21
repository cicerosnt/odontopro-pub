
/**
 * Converte um valor monetario em (BRL) para centavos
 * @param {string} amount - O valor monetario em reais (BRL) a ser convertido
 * @returns {number} O valor convertido em centavos
 * @example
 * convertRealToCents("1.300,50") // retona 1300.50
 */
export function convertRealToCents(amount: string): number{
    const numericPrice = parseFloat(amount.replace(/\./g, "").replace(',', '.'))
    const numericCents = Math.round(numericPrice * 100)
    
    return numericCents
}
