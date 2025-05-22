"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { ReminderFormData, useReminderForm } from "./reminder-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SaveIcon } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { creteReminder } from "../../_actions/create-reminder"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useState } from "react"
import LoadingSpinner from "@/components/ui/loading"

interface  ReminderContentProps{
    closeDialog: () => void
}

export function ReminderContent({closeDialog}: ReminderContentProps){

    const form = useReminderForm()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    
    async function onSubmit(formData:  ReminderFormData){
    
        setIsLoading(true)
        
        const response = await creteReminder({
            title: formData.title,
            description: formData.description
        })
        
        if(response.error){
            toast.warning(response.error)
            return
        }
        
        toast.success("Lemrete cadastrado com sucesso!")
        router.refresh()
        closeDialog()
        
        setIsLoading(false)
    }

    return (
        <div className="grid gap-4 py-4">
            {isLoading ? (
                <LoadingSpinner fullscreen={false} />
            ):(
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <FormField
                            {...form}
                            control={form.control}
                            name="title"
                            render={({field}) => (
                                <FormItem className="mb-4">
                                <FormLabel className="font-semibold">Titulo do lembrete</FormLabel>
                                 <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="Ligar para o João"
                                        className=""
                                    />
                                 </FormControl>
                                 <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <FormField
                            {...form}
                            control={form.control}
                            name="description"
                            render={({field}) => (
                                <FormItem >
                                <FormLabel className="font-semibold">Descrição do lembrete</FormLabel>
                                 <FormControl>
                                    <Textarea
                                        {...field}
                                        placeholder="Avisar sobre o agendamento de amanhã."
                                        className="max-h-52 resize-none"
                                    />
                                 </FormControl>
                                 <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <Button
                            type="submit"
                            disabled={!form.watch("title") || !form.watch("description")}
                            className="flex gap-2 items-center w-[40%] mt-6 mx-auto cursor-pointer"
                        >
                            <SaveIcon className="w-5 h-5"  />
                            Salvar
                        </Button>
                    </form>
                </Form>
                )}
            </div>
    )
}
