"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

export const reminderSchema = z.object({
    title: z.string().min(1, "Precisa informar um titulo para o lembrete"),
    description: z.string().min(1, "Você deve infromar uma descrição para o lembrete!")
})

export type ReminderFormData = z.infer<typeof reminderSchema>

export function useReminderForm(){
    return useForm<ReminderFormData>({
        resolver: zodResolver(reminderSchema),
        defaultValues: {
            title: "",
            description: ""
        }
    })
}
