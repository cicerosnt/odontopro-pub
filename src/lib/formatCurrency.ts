const CURRENCY_FORMATTER = new Intl.NumberFormat("pt-BR", {
  currency: "BRL",
  style: "currency",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/**
 * Formata um número para o formato de moeda brasileira (BRL) com duas casas decimais.
 *
 * @param {number} value - Valor numérico a ser formatado.
 * @returns {string} Valor formatado como moeda brasileira.
 *
 * @example
 * formatCurrency(1400) // "R$ 1.400,00"
 */
export function formatCurrency(value: number) {
  return CURRENCY_FORMATTER.format(value)
}
