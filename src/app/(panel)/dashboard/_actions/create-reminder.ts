"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const formSchema = z.object({
    title: z.string().min(1, "Preisa informar um titulo para o lembrete."),
    description: z.string().min(1, "Preisa inormar uma descrição para o lembrete..")
})

type FormaSchema = z.infer<typeof formSchema>

export async function creteReminder(formData: FormaSchema) {

    const session = await auth()
    
    if(!session?.user.id){
        return {
            error: "Falha ao cadatrar lembrete."
        }
    }

    const schema = formSchema.safeParse(formData)
    
    if(!schema.success){
        return {
            error: schema.error.issues[0].message
        }
    }
    
    try {
    
        await prisma.reminder.create({
            data: {
                title: formData.title,
                description: formData.description,
                userId: session.user.id,
            },
            
        })
        
        revalidatePath("/dashboard")
    
        return {
            data: "Lembrete cadastrado com sucesso!"
        }
        
    }catch(err){
        // console.log(err)
        return {
            error: "Erro ao cadatrar."
        }
    }
}
