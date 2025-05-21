/**
 * Converte um valor em minutos para o formato de hora e minuto (HH:MM).
 *
 * @param {number} value - Valor em minutos.
 * @returns {string} String formatada no formato "HH:MM".
 *
 * @example
 * convertMinutesInHours(135) // "02:15"
 * convertMinutesInHours(60)  // "01:00"
 */
export default function convertMinutesInHours(value: number): string {
  const hours = Math.floor(value / 60)
  const minutes = value % 60

  const paddedHours = String(hours).padStart(2, "0")
  const paddedMinutes = String(minutes).padStart(2, "0")

  return `${paddedHours}:${paddedMinutes}`
}
