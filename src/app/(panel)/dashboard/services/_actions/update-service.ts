"use server"

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";


const formSchema = z.object({
    serviceId: z.string().min(1, {message: "Precisa esta logando para editar"}),
    name: z.string().min(1, {message: "O nome do serviço é obrigatório"}),
    price: z.number().min(1, {message: "O preço do serviço é obrigatório"}),
    duration: z.number()
})

type FormSchema = z.infer<typeof formSchema>

export async function updateService(formData: FormSchema){
    const session = await auth();
    
    if(!session?.user?.id){
        return {
            error: "Inicie uma sessão para editar um serviço. Fala ao cadastrar."
        }
    }
    
    const schema = formSchema.safeParse(formData);
    
    if(!schema.success){
        return {
            error: schema.error.issues[0].message
        }
    }
    
    try{
    
        const serviceUpdated = await prisma.service.update({
            where: {
                id: formData.serviceId,
                userId: session?.user?.id
            },
            data: {
                name: formData.name,
                price: formData.price,
                duration: formData.duration,
                // duration: formData.duration < 30 ? 30 : formData.duration,
            }
        })
    
        return {
            data: serviceUpdated
        }
    }catch(err){
        console.log(err);
        return {
            error: "Falaha ao atualizar o serviço."
        }
    }
}
