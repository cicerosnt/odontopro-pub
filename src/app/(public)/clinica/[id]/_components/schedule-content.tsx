"use client"

import Image from "next/image"
import imageDefault from "../../../../../../public/foto1.png"
import { MapPin, Save, Wheat } from "lucide-react"
import { Prisma } from "@/generated/prisma"
import { AppointmentFormData, useAppointmentForm } from "./schedule-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { formatPhone } from "@/ultils/formatPhone"
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCallback, useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { ScheduleTimeList } from "./schedule-time-list"
import { DateTimePicker } from "./date-picker"
import LoadingSpinner from "@/components/ui/loading"
import { createNewAppointment } from "../_actions/cretae-appointment"
import { toast } from "sonner"


type UserWithServiceAndSubscription = Prisma.UserGetPayload<{
  include: {
    subscription: true,
    services: true
  }  
}>

interface ScheduleContentProps {
    clinic: UserWithServiceAndSubscription
}

export interface TimeSlot {
    time: string;
    available: boolean
}

export function ScheduleContent({ clinic }: ScheduleContentProps) {

    const form = useAppointmentForm()
    const { watch } = form
    
    const selectedDate = watch("date")
    const selectedServiceId = watch("serviceId")
    
    const [selectedTime, setSelectedTime] = useState("")
    const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([])
    const [loadingSlots, setLoadingSlots] = useState(false)
    const [initialDate] = useState(() => new Date());
    
  // Quais os horários bloqueados 01/02/2025 > ["15:00", "18:00"]
    const [blockedTimes, setBlockedTimes] = useState<string[]>([])
    

  // Função que busca os horários bloqueados (via Fetch HTTP)
    const fetchBlockedTimes = useCallback(async (date: Date): Promise<string[]> => {
        setLoadingSlots(true)
        try {
            const dateString = date.toISOString().split("T")[0]   
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/schedule/get-appointments?userId=${clinic.id}&date=${dateString}`)
            
            const json = await response.json()
            setLoadingSlots(false)
            
            return json // Retornar o array com horarios que já tem bloqueado desse Dia e dessa clinica.
            
        } catch (err) {
            console.log(err)
            setLoadingSlots(false)
            return []
        }
    }, [clinic.id])
    
    useEffect(() => {
    
        if (selectedDate) {
            fetchBlockedTimes(selectedDate).then((blocked) => {
                // Garante que blocked é um array
                const blockedArray = Array.isArray(blocked) ? blocked : [];
                setBlockedTimes(blockedArray);
    
                const times = clinic.times || []
    
                const finalSlots = times.map((time) => ({
                    time: time,
                    available: !blockedArray.includes(time) 
                }))
                
                setAvailableTimeSlots(finalSlots)
                
                // verificar se o horario eta disponivel, limpamos a seleção
                const stillAvailable = finalSlots.find(
                    (slot) => slot.time === selectedTime && slot.available
                )
                
                if(!stillAvailable) {
                    setSelectedTime("")
                }
                
            })
        }
    
    }, [selectedDate, clinic.times, fetchBlockedTimes, selectedTime])
    
    async function handleRegisterAppointment(formData: AppointmentFormData) {
        if(!selectedTime) {
            return;
        }
        
        const appointmentData = {
            ...formData,
            time: selectedDate,
            clinicId: clinic.id
        }
        
        const response = await createNewAppointment({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            time: selectedTime,
            date: formData.date,
            serviceId: formData.serviceId,
            clinicId: clinic.id
        })
        
        if(response.error){
            toast.warning(response.error)
            return
        }
        
        toast.success("✅ Tudo certo!\n\nSeu agendamento foi realizado com sucesso.")
        form.reset()
        setSelectedTime("")
    }

    return (
        <section className="min-h-screen flex flex-col">
            <div className="h-32 bg-emerald-500" />
            
            <div className="container mx-auto px-4 -mt-16">
                <div className="max-w-2xl mx-auto">
                    
                    <article className="flex flex-col items-center">
                        <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white mb-4">
                            <Image
                                src={clinic.image || imageDefault}
                                alt="Foto da clinica"
                                fill
                                className="object-cover"
                            />
                        </div>
                        
                        <h1 className="text-xl font-bold mb-2">
                            {clinic.name}
                        </h1>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{clinic.address || "Endereço não informado."}</span>
                        </div>
                    </article>
                    
                </div>
            </div>
            
            
            <div className="max-w-2xl mx-auto w-full mt-6">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleRegisterAppointment)}
                        className="space-y-6 bg-white p-6 border rounded-mg shadow-sm mx-2"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="my-2">
                                    <FormLabel className="font-semibold">Nome Completo</FormLabel>
                                    <FormControl>
                                        <Input
                                            id="name"
                                            placeholder="João da Silva"
                                            {...field}
                                            className="py-5 px-3"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="my-2">
                                    <FormLabel className="font-semibold">E-mail</FormLabel>
                                    <FormControl>
                                        <Input
                                            id="email"
                                            placeholder="joao@gmail.com"
                                            {...field}
                                            className="py-5 px-3"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-semibold">Telefone</FormLabel>
                                    <FormControl>
                                        <Input
                                            id="phone"
                                            placeholder="(17) 99999-9999"
                                            {...field}
                                            onChange={(e) => {
                                                const formattedValue = formatPhone(e.target.value)
                                                field.onChange(formattedValue)
                                            }}
                                            className="py-5 px-3"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col items-start gap-2 space-y-1">
                                    <FormLabel className="font-semibold">Data para o agendamento</FormLabel>
                                    <FormControl>
                                        <DateTimePicker
                                            initialDate={initialDate}
                                            className="w-full rounded border p-2"
                                            onChange={(date) => {
                                                if (date) {
                                                    field.onChange(date)
                                                    setSelectedTime("")
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <FormField
                            control={form.control}
                            name="serviceId"
                            render={({ field }) => (
                                <FormItem className="min-w-full ">
                                    <FormLabel className="font-semibold">Qual serviço deseja agendamento?</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={(value) => {
                                                field.onChange(value)
                                                setSelectedTime("")
                                            }}
                                        >
                                            <SelectTrigger className="w-full p-3">
                                                <SelectValue placeholder="Selecione um serviço" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {clinic.services.map((service) => (
                                                    <SelectItem 
                                                        key={service.id} 
                                                        value={service.id}
                                                        className="not-last:border-b-1 py-2"
                                                    >
                                                        {`${service.name} - ${Math.floor(service.duration / 60)}h${service.duration % 60}`}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        {selectedServiceId && (
                            <div className="space-y-2">
                                <Label className="font-semibold">Horários disponíveis</Label>
                                <div className="bg-gray-100 p-4 rounded-lg relative">
                                    {loadingSlots ? (
                                        <LoadingSpinner fullscreen={false} />
                                    ) : availableTimeSlots.length === 0 ? (
                                        <p>
                                            🙁 Horários esgotados para este serviço.
                                        </p>
                                    ) : (
                                        <ScheduleTimeList
                                            onSelectTime={(time: string) => setSelectedTime(time)}
                                            clinicTimes={clinic.times}
                                            blockedTimes={blockedTimes}
                                            availableTimeSlots={availableTimeSlots}
                                            selectedTime={selectedTime}
                                            selectedDate={selectedDate}
                                            requiredSlots={
                                                clinic.services.find(service => service.id === selectedServiceId) ? 
                                                Math.ceil(
                                                    clinic.services.find(
                                                        service => service.id === selectedServiceId
                                                    )!.duration / 30
                                                ) : 1
                                            }
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                        
                    
                        <div className="w-full">
                            {clinic.status ? (
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="flex gap-3 items-center mx-auto w-[40%] cursor-pointer bg-emerald-500 hover:bg-emerald-400"
                                    disabled={!watch("name") || !watch("email") || !watch("phone") || !watch("date") || !watch("serviceId")}
                                >
                                    <Save className="w-5 h-5" />
                                    Salvar
                                </Button>
                            ) : (
                                <p className="border border-red-200 bg-red-100 rounded-lg py-2 px-4 text-center">A clinica esta fechada nesse momento!</p>
                            )}
                        </div>
                        
                        
                    </form>            
                </Form>
            </div>
        </section>
    )
}
