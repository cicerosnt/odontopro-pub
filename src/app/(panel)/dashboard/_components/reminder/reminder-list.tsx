"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Reminder } from "@/generated/prisma";
import { Plus, Trash } from "lucide-react";
import { deleteReminder } from "../../_actions/delete-reminder";
import { toast } from "sonner";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReminderContent } from "./reminder-content";
import { useState } from "react";

interface ReminderListProps {
  reminder: Reminder[];
}

export function ReminderList({ reminder }: ReminderListProps) {
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  // console.log("LEMBRETES-LIST: ", reminder)

  async function handleDeleteReminder(reminderId: string) {
    const response = await deleteReminder({ reminderId });

    if (response.error) {
      toast.warning(response.error);
      return;
    }

    toast.success("✅ Lembrete excluído com sucesso.");
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl md:text-2xl font-bold">
            Lembretes
          </CardTitle>

          <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
            <DialogTrigger asChild>
              <Button size="icon" className="cursor-pointer">
                <Plus className="w-5 h-5" />
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Novo Lembrete</DialogTitle>
                <DialogDescription>
                  Preencha o formulário para criar um novo lembrete.
                </DialogDescription>
              </DialogHeader>

              <ReminderContent closeDialog={() => setIsOpenDialog(false)} />
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          <ScrollArea className="h-[340px] lg:max-h-[calc(100vh - 15rem)] p-0 w-full flex-1">
            {reminder.length === 0 ? (
              <p>Quando tiver lembretes, aparecerão aqui.</p>
            ) : (
              reminder.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-wrap flex-row items-center justify-between py-2 px-3 bg-yellow-100 mb-2 rounded-md"
                >
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-foreground text-sm lg:text-base">
                      {item.description}
                    </p>
                  </div>

                  <Button
                    size="icon"
                    onClick={() => handleDeleteReminder(item.id)}
                    className="bg-red-500 hover:bg-red-600 shadow-none rounded-full cursor-pointer"
                  >
                    <Trash className="w-5 h-5" />
                  </Button>
                </article>
              ))
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
