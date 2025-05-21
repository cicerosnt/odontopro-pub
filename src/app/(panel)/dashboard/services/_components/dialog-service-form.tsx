"use client"

import { zodResolver }  from "@hookform/resolvers/zod";
import{ useForm } from "react-hook-form";
import {z} from "zod"

export interface UseDialogServiceFormProps{
  initialValues?: {
    name: string;
    price: string;
    hours: string;
    minutes : string;
  }
}

const formSchema = z.object({
  name: z.string().min(1, {message: "Nome do serviço"}),
  price: z.string().min(1, {message: "O preço do serviço é obrigatorio"}),
  hours: z.string(),
  minutes: z.string(),
})

export type DialogServiceFormData = z.infer<typeof formSchema>;

export function useDialogServiceForm({initialValues}: UseDialogServiceFormProps){
  return useForm<DialogServiceFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      name: "",
      price: "",
      hours: "",
      minutes: ""
    }
  })
}
