"use server"

import prisma from "@/lib/prisma"

export async function getInfoSchedule({userId}: {userId: string}) {

    if(!userId){
        return null
    }
    
    try{
    
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                subscriptionId: true,
                services: {
                    where: {
                        status: true
                    },
                }
            }
        })
        
        if(!user){
            return null
        }
        
        return user
    
    }catch(err){
        console.log(err)
        return null
    }
}
