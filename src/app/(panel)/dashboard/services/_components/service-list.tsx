"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Loader, LoaderCircleIcon, LoaderPinwheel, LoaderPinwheelIcon, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { DialogService } from "./dialog-service";
import { Service } from "@/generated/prisma";
import { formatCurrency } from "@/lib/formatCurrency";
import clsx from "clsx";
import { deleteService } from "../_actions/delete-service";
import { toast } from "sonner";
import Placeholder from "@/components/ui/placeholder";
import LoadingSpinner from "@/components/ui/loading";
import convertSecondsInHors from "@/ultils/convertMinutesInHours";

interface ServicesListProps {
  services: Service[]
}

export function ServicesList({ services }: ServicesListProps) {

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<null | Service>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPage, setIsLoadingPage] = useState(false)
  
  async function handleDeleteService(serviceId: string) {
  
    setIsLoading(true)
  
    const response = await deleteService({ serviceId: serviceId })
    
    if (response.error) {
      toast.error(response.error)
      return
    }
    setIsLoading(false)
    toast.success(response.data)
  }
  
  function handleEditService(service: Service) {
    setEditingService(service)
    setIsDialogOpen(true)
  }
  
  if(isLoading){
    return (
      <LoadingSpinner fullscreen={true} size={32} color="border-gray-300" />
    )
  }

  return !isLoadingPage ? (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <section className="mx-auto">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl md:text-2xl font-bold">Serviços</CardTitle>
  
            <DialogTrigger asChild>
              <Button className="cursor-pointer flex gap-2 items-center">
                <Plus className="w-4 h-4" />
                Novo
              </Button>
            </DialogTrigger>
  
            <DialogContent
              onInteractOutside={(e) => {
                e.preventDefault()
                setIsDialogOpen(false)
                setEditingService(null)
              }}
            >
              <DialogService
                closeModal={() => {
                  setIsDialogOpen(false)
                  setEditingService(null)
                }}
                serviceId={editingService ? editingService.id : undefined}
                initialValues={
                  editingService
                    ? {
                        name: editingService.name,
                        price: (editingService.price / 100)
                          .toFixed(2)
                          .replace('.', ','),
                        hours: Math.floor(editingService.duration / 60).toString(),
                        minutes: (editingService.duration % 60).toString(),
                      }
                    : undefined
                }
              />
            </DialogContent>
          </CardHeader>
  
          <CardContent>
            <section className="space-y-4 mt-5">
              <div className="space-y-2">
                {services.map((service) => (
                  <article
                    key={service.id}
                    className={clsx(
                      'group/item flex gap-6 md:gap-8 items-center justify-between bg-card p-4 rounded-lg shadow-sm transition-all duration-200 hover:bg-accent/50 group',
                      { 'bg-gray-400': !service.status }
                    )}
                  >
                    <div className="flex items-center justify-between flex-1 min-w-0">
                      <span className="font-medium text-primary truncate">
                        {service.name}
                      </span>
                      <span className="text-muted-foreground mx-2">•</span>
                      <span className="font-medium text-primary truncate">
                        {convertSecondsInHors(service.duration)}
                      </span>
                      <span className="text-muted-foreground mx-2">•</span>
                      <span className="font-medium text-right text-primary tabular-nums">
                        {formatCurrency(service.price / 100)}
                      </span>
                    </div>
  
                    <div className="flex gap-2 group/edit invisible group-hover/item:visible">
                      <Button
                        variant="ghost"
                        title="Editar"
                        size="icon"
                        className="group-hover:bg-gray-300 hover:bg-gray-600 hover:text-gray-100 transition-colors cursor-pointer"
                        onClick={() => handleEditService(service)}
                      >
                        <Pencil className="w-5 h-5" />
                        <span className="sr-only">Editar serviço</span>
                      </Button>
  
                      <Button
                        variant="ghost"
                        title="Excluir"
                        size="icon"
                        className="group-hover:bg-destructive/10 hover:bg-destructive/50 hover:text-gray-100 transition-colors cursor-pointer"
                        onClick={() => handleDeleteService(service.id)}
                      >
                        <Trash2 className="w-5 h-5" />
                        <span className="sr-only">Excluir serviço</span>
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </CardContent>
        </Card>
      </section>
    </Dialog>
  ) : (
    <Placeholder count={5} />
  )

}
