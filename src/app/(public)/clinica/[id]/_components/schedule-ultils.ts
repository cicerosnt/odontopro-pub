
/**
 * Varifica se a data recebida é hoje!
 * @param date // recebe uma data ex.: 20/05/2025
 * @returns // retorna a data atual
 */
export function isToDay(date: Date){
    const now = new Date()
    
    return (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate()
    )
}

/**
 * Verifica se um determinado slot ja passou
 */
export function isSlotInThePast(slotTime: string) {
    const [slotHour, slotMinute] = slotTime.split(":").map(Number)
    
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    
    if (slotHour < currentHour) {
        return true
    } else if (slotHour === currentHour && slotMinute <= currentMinute) {
        return true
    }
    
    return false
}
/**
 * Valida os slots disponiveis para agendamento baseado no horario (tempo do serviço selecionado), incluindo os osharios bloqueados
 * @param startSlot         // primeiro horario disponivel
 * @param requiredSlots     // quantidade de slots necessaria
 * @param allSlots          //todos os horario da clinca
 * @param blockedSlots      //horarios blockeadoss
 * @returns                 // retorna false ou true caso esteja de acordo
 */
export function isSlotSequenceAvailable(
    startSlot: string,      
    requiredSlots: number,  
    allSlots: string[],     
    blockedSlots: string[]  
) {
    
    const startIndex = allSlots.indexOf(startSlot)
    
    // esse if não permite que o cliente agende um horario de 1h00 por exemplo no ultimo horario as18h30, caso desejar optar por essa função, remover: || startIndex + requiredSlots > allSlots.length
    if (startIndex === -1 || startIndex + requiredSlots > allSlots.length) {
        return false
    }
    
    // reserva os slotes necessario de acordo com o horario do serviço, ex.: serviço 1h30, ele reserva das 8h as 9h30, por exemplo
    for (let i = startIndex; i < startIndex + requiredSlots; i++) {
        const slotTime = allSlots[i]
        
        if (blockedSlots.includes(slotTime)) {
            return false
        }
    }
    
    return true
}
