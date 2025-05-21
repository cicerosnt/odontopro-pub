"use client"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { ProfileFormaData, useProfileForm } from "./profile-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

import imageDefault from "../../../../../../public/foto1.png"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ArrowRight, LogOut, SaveAllIcon, Trash2, X } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import clsx from "clsx"
import { Subscription, User } from "@/generated/prisma"
import { updateProfile } from "../_actions/update-profile"
import { toast } from "sonner"
import { formatPhone } from "@/ultils/formatPhone"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"


interface ProfileContentProps {
  user: User & {
    subscription: Subscription;
  }
}

export function ProfileContent({user}: ProfileContentProps) {

  const {update} = useSession()
  const [selectedHours, setSelectedHours] = useState<string[]>(user.times ?? [])
  const [dialogIsOpen, setDialogIsOpen] = useState(false)
  const timeZone = Intl.supportedValuesOf("timeZone").filter((zone) => {
    return (
      zone === "America/Sao_Paulo" ||      // Zona Sul/Sudeste/Centro-Oeste
      zone === "America/Fortaleza" ||      // Nordeste (UTC-3)
      zone === "America/Recife" ||         // Nordeste (UTC-3)
      zone === "America/Belem" ||          // Norte/Nordeste (UTC-3)
      zone === "America/Manaus" ||         // Norte (UTC-4)
      zone === "America/Cuiaba" ||         // Centro-Oeste (UTC-4)
      zone === "America/Boa_Vista" ||      // Norte (UTC-4)
      zone === "America/Porto_Velho" ||    // Norte (UTC-4)
      zone === "America/Rio_Branco"     // Norte (UTC-5)
    );
  });
  
  const router = useRouter()
  
  const form = useProfileForm({name: user.name, address: user.address, phone: user.phone, status: user.status || false, timezone: user.timezone})

  function toggleHours(hour: string){
    setSelectedHours((prev) => prev.includes(hour) ? prev.filter(h => h !== hour) : [...prev, hour])
  }
  
  function generateTimesSots(): string[]{
    const hours: string[] = []
    
    for(let i = 8; i <= 24; i++){
      for(let j = 0; j < 2; j++){
        const hour = i.toString().padStart(2, "0")
        const minute = (j * 30).toString().padStart(2, "0")
        hours.push(`${hour}:${minute}`)
      }
    }
    
    return hours
  }
  
  const hours = generateTimesSots()
  
  async function onSubmit(values: ProfileFormaData) {
    // const profileData = {
    //   ...values,
    //   times: selectedHours
    // }
    
    // const extractValuePhone = extractPhoneNumber(values.phone || "")
    
    const response = await updateProfile(
      {
        name: values.name,
        address: values.address,
        phone: values.phone,
        status: values.status == 'active' ? true : false,
        timezone: values.timezone,
        times: selectedHours || []
      }
    )
    
   if(response.error){
    toast.warning(response.error, {closeButton: true})
   }
   
   toast.success(response.data)
  }
  
  async function handleLogOut() {
    await signOut()
    await update()
    
    router.replace("/")
  }
  

  return (
    <div className="mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader className="flex gap-2 justify-between">
              <CardTitle>Meu Perfil</CardTitle>
              
              <Button 
                className="cursor-pointer font-semibold"
                variant="destructive" onClick={() => handleLogOut}
              >
                <LogOut  />
                Sair
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <div className="bg-gray-200 relative h-40 w-40 rounded-full overflow-hidden">
                  <Image
                    src={user.image || imageDefault}
                    alt="Apenas uma foto padrão"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Nome da Clinica
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nome da clinica"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Endereço do Local
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Endereço da clinica" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div>
                  <p className="font-semibold mt-[15px]">E-mail</p>
                  <p className="text-muted-foreground border border-gray-200 p-2 mt-1 rounded-sm">{user.email}</p>
                </div>

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Telefone</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="(17) 99999-9999" onChange={(e) => {
                          const fPhone = formatPhone(e.target.value)
                          field.onChange(fPhone)
                        }} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Status da clinica
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value ? "active" : "inactive"}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione um status" />
                          </SelectTrigger>

                          <SelectContent>
                            <SelectItem value="active">
                              Ativo (aberto)
                            </SelectItem>
                            <SelectItem value="inactive">
                              Inativo (fechado)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <Label className="font-semibold">
                    Horários de atendimento
                  </Label>

                  <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen} >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between cursor-pointer">
                        Clique aqui para selecionar
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    </DialogTrigger>

                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Horarios da clinica</DialogTitle>
                        <DialogDescription>
                          Selecione a baixo os horario de funcionamento para a
                          sua clinica.
                        </DialogDescription>
                      </DialogHeader>

                      <section className="py-4">
                        <p className="text-sm text-muted-foreground mb-2">
                          Clique para selecionar os horarios
                        </p>
                        <div className="grid grid-cols-5 gap-2">
                          {hours.map((hour) => (
                            <Button 
                              key={hour}
                              variant="outline"
                              className={cn("h-10 border-2", selectedHours.includes(hour) && "border-emerald-500")}
                              onClick={() => toggleHours(hour)}
                            >
                              {hour}
                            </Button>
                          ))}
                        </div>
                      </section>
                      <Button 
                        className="w-full cursor-pointer w-[40%] mx-auto" 
                        onClick={() => setDialogIsOpen(false)}
                      > 
                        <X className="h-5 w-5"/>
                        Fechar
                      </Button>
                    </DialogContent>
                  </Dialog>
                  
                  <div className={clsx("flex flex-wrap gap-2 p-4 bg-card rounded-lg shadow-sm", {"hidden": !selectedHours || selectedHours.length < 1})}>
                    {selectedHours.map((hour, index) => (
                      <button 
                        key={index}
                        onClick={() => toggleHours(hour.toString() as string)}
                        className="relative px-3 py-1.5 rounded-md bg-primary/10 text-primary text-sm font-medium border border-primary/20 transition-all hover:bg-primary/20 hover:shadow-md cursor-pointer select-none "
                      >
                        {hour}
                        <Trash2 className="absolute w-5 h-5 p-0.5 border border-red-300 text-red-500 top-[-6px] right-[-6px] bg-gray-300 rounded-full"/>
                      </button>
                    ))}
                  </div>
                </div>
                
                <FormField
                  control={form.control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Fuso horário local
                      </FormLabel>
                      <FormControl>
                        <Select
                          defaultValue="America/Sao_Paulo"
                          onValueChange={(value) => field.onChange(value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione seu fuso horário" />
                          </SelectTrigger>
                
                          <SelectContent>
                            {timeZone.map((zone) => (
                              <SelectItem 
                                key={zone} 
                                value={zone}
                                className="cursor-pointer hover:bg-accent"
                              >
                                {zone}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <Button className="flex justify-center items-center gap-2 mx-auto cursor-pointer">
                  <SaveAllIcon className="w-6 h-6 " />
                  Salvar alterações
                </Button>
                
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  )
}
