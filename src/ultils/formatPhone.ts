export function formatPhone(phone: string){
    const cleanPhone = phone.replace(/\D/g, '')
    
    if (cleanPhone.length > 11){
        return phone.slice(0, 15)
    }
    
    const formattedPhone = cleanPhone
        .replace(/^(\d{2})(\d)/g, "($1) $2")
        .replace(/(\d{5,5})(\d{4})$/, "$1-$2")
        
    return formattedPhone
}

// export function extractPhoneNumber(phone: string){
//     const phoneValue = phone.replace(/[\(\)\s-]/g, "")
    
//     return phoneValue 
// }
