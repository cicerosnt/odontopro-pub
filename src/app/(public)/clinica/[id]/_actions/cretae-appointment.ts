"use server"

import prisma from "@/lib/prisma"
import { z } from "zod"

const formSchema = z.object({
    name: z.string().min(1, "o Nome é obrigatório"),
    email: z.string().email("o Email é obrigatório"),
    phone: z.string().min(1, "o Telefone é obrigatório"),
    date: z.date(),
    serviceId: z.string().min(1, "o Serviço é obrigatório"),
    time: z.string().min(1, "o Horário é obrigatório"),
    clinicId: z.string().min(1, "A Clinica é obrigatório"),
})

type FormSchema = z.infer<typeof formSchema>

export async function createNewAppointment(formData: FormSchema){

    const schema = formSchema.safeParse(formData)

    if(!schema.success){
        return {
            error: schema.error.issues[0].message
        }
    }
    
    try {
    
        const selectedDate = new Date(formData.date)
        const year = selectedDate.getFullYear()
        const month = selectedDate.getMonth()
        const day = selectedDate.getDate()
        
        const appointmentDate = new Date(year, month, day, 0, 0, 0, 0)
        
        const newAppointment = await prisma.appointment.create({
            data: {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                time: formData.time,
                appointmentDate: appointmentDate,
                serviceId: formData.serviceId,
                userId: formData.clinicId
                
            }
        })
        
        return {
            data: newAppointment
        };
    }catch(err){
        // console.log(err)
        return {
            error: "⚠️ Ocorreu um erro ao tentar agendar.\n\nPor favor, verifique as informações e tente novamente."
        }
    }   
}
