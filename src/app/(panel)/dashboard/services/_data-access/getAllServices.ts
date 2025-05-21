"use server"

import prisma from "@/lib/prisma"


export async function getAllServices(usersId: string) {
    if(!usersId) {
        return {
            error: "Falha ao buscar os serviços"
        }
    }
    
    try {
    
        const services = await prisma.service.findMany({
            where: {
                userId: usersId,
                // status: true
            }
        })
    
        
        return {
            data: services
        }    
    }catch(err){
        console.log(err)
        return {
            error: "Falha ao buscar serviços"
        }
    }
}
