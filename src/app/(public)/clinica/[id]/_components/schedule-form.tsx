"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"


export const appointmentSchema = z.object({
    name: z.string().min(1, "O Nome é obrigatório."),
    email: z.string().email().min(1, "O E-mail pe obrigatório."),
    phone: z.string().min(11, "O Telefone é obrigatório."),
    date: z.date(),
    serviceId: z.string().min(1, "O serviço é obrigatório"),
})

export type AppointmentFormData = z.infer<typeof appointmentSchema>

export function useAppointmentForm() {
    return useForm<AppointmentFormData>({
        resolver: zodResolver(appointmentSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            serviceId: "",
            date: new Date(),
        }
    })
}
