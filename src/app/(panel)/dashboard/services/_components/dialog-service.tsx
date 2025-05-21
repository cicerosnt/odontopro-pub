"use client";

import { DialogHeader } from "@/components/ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { DialogServiceFormData, useDialogServiceForm } from "./dialog-service-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import React, { useState } from "react";
import { convertRealToCents } from "@/ultils/covertCurrency";
import { createNewService } from "../_actions/create-service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Service } from "@/generated/prisma";
import { updateService } from "../_actions/update-service";

interface DialogServiceProps {
    closeModal: () => void,
    serviceId?: string,
    initialValues?: {
        name: string;
        price: string;
        hours: string;
        minutes: string
    }
}

export function DialogService({closeModal, initialValues, serviceId}: DialogServiceProps) {

    const form = useDialogServiceForm({initialValues: initialValues})
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    
    async function onSubmit(values: DialogServiceFormData) {
    
        setLoading(true)
        let priceCents = convertRealToCents(values.price)
        
        const hours = parseInt(values.hours) || 0
        const minutes = parseInt(values.minutes) || 0
        
        const duration = (hours * 60) + minutes
        
        if(serviceId){
            await editServiceById({
                serviceId: serviceId,
                name: values.name,
                priceCents: priceCents, 
                duration: duration
            })
            
            setLoading(false)
            
            return
        }
        
        const response = await createNewService({
            name: values.name,
            price: priceCents,
            duration: duration
        })
        
        setLoading(false)
        
        if(response.error){
            toast.error(response.error)
            return
        }
        
        toast.success("Serviço cadastrado com sucesso!")
        form.reset()
        handleCloseModal()
    }
    
    function changeCurrency(event: React.ChangeEvent<HTMLInputElement>){
        let { value } = event.target;
        
        value = value.replace(/\D/g, "")
        
        if (value) {
            value = (parseInt(value, 10) / 100).toFixed(2)
            value = value.replace('.', ",")
            value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
        }
        
        event.target.value = value
        form.setValue("price", value)
    }
    
    function handleCloseModal(){
        closeModal()
        router.refresh()
    }
    
    async function editServiceById({
        serviceId, 
        name, 
        priceCents, 
        duration
    }:{ serviceId: string,  name: string, priceCents: number, duration: number }){
    
        setLoading(true)
        const response = await updateService({
            serviceId: serviceId,
            name: name,
            price: priceCents,
            duration: duration
        })
        
        if(response.error){
            toast.error(response.error)
            return
        }
        
        setLoading(false)
        handleCloseModal()
        toast.success("Dados atualizados com sucesso!")
    }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-bold">Formulário de cadastro</DialogTitle>
        <DialogDescription>Preencha com os dados do serviço</DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form
            className="space-y-2"
            onSubmit={form.handleSubmit(onSubmit)}
        >
            <div className="flex flex-col gap-3">
                <FormField
                    control={form.control}
                    name="name"
                    render={({field}) => (
                        <FormItem>
                           <FormLabel className="font-semibold">
                                Nome do serviço
                           </FormLabel> 
                           <FormControl>
                                <Input 
                                    {...field} 
                                    placeholder="Aplicação de botox" 
                                    className="py-5 px-3 "
                                />
                           </FormControl>
                        </FormItem>
                    )}
                />
                
                <FormField
                    control={form.control}
                    name="price"
                    render={({field}) => (
                        <FormItem>
                           <FormLabel className="font-semibold">
                                Valor do Serviço
                           </FormLabel> 
                           <FormControl>
                                <Input 
                                    {...field} 
                                    placeholder="R$ 0,00" 
                                    className="py-5 px-3 "
                                    onChange={changeCurrency}
                                />
                           </FormControl>
                        </FormItem>
                    )}
                />
            </div>
            <p className="font-semibold">Tempo e duração do serviço</p>
            <div className="grid grid-cols-2 gap-3">
                <FormField
                    control={form.control}
                    name="hours"
                    render={({field}) => (
                        <FormItem>
                           <FormLabel className="font-semibold">
                                Tempo/Duração (hora)
                           </FormLabel> 
                           <FormControl>
                                <Input 
                                    {...field} 
                                    placeholder="1" 
                                    min={1}
                                    type="number"
                                    className="py-5 px-3 "
                                />
                           </FormControl>
                        </FormItem>
                    )}
                />
                
                <FormField
                    control={form.control}
                    name="minutes"
                    render={({field}) => (
                        <FormItem>
                           <FormLabel className="font-semibold">
                                Tempo/Duração (minutos)
                           </FormLabel> 
                           <FormControl>
                                <Input 
                                    {...field} 
                                    placeholder="0" 
                                    min={0 }
                                    type="number"
                                    className="py-5 px-3 "
                                />
                           </FormControl>
                        </FormItem>
                    )}
                />
            </div>
            
            <div className="flex justify-center items-center mt-8">
                <Button 
                    type="submit" 
                    className="cursor-pointer font-semibold text-white w-[40%] mx-auto"                                      
                    disabled={loading}
                >
                    <Save className="w-5 h-5" />
                    {loading ? "Carregandoo..." : `${serviceId ? "Atualizar" : "Salvar"}`}
                </Button>
            </div>
        </form>
      </Form>
    </>
  );
}
