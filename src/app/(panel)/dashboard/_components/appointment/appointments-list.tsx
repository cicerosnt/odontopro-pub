"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingSpinner from "@/components/ui/loading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Prisma } from "@/generated/prisma";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";

type AppointmentWithService = Prisma.AppointmentGetPayload<{
  include: {
    service: true;
  };
}>;

interface AppointmentListProps {
  times: string[];
}

export function AppointmentsList({ times }: AppointmentListProps) {
  const searchParams = useSearchParams();
  const date = searchParams.get("date");

  const { data, isLoading } = useQuery({
    queryKey: ["get-appointments", date],
    queryFn: async () => {
      // o que vamos buscar em nossa rota
      let activeDate = date;

      if (!activeDate) {
        activeDate = format(new Date(), "yyyy-MM-dd");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/clinic/appointments?date=${activeDate}`,
      );

      const json = (await response.json()) as AppointmentWithService[];

      if (!response.ok) return [];

      return json;
    },
  });

  // Monta occupantMap slot > appointment
  // Se um Appointment começa no time (15:00) e tem requiredSlots 2
  // occupantMap["15:00", appoitment] occupantMap["15:30", appoitment]
  const occupantMap: Record<string, AppointmentWithService> = {};
  console.log("occupantMap: ", occupantMap);

  if (data && data.length > 0) {
    for (let appointment of data) {
      // Calcular quantos slots necessarios ocupa
      const requiredSlots = Math.ceil(appointment.service.duration / 30);

      // Descobrir qual é o indice do nosso array de horarios esse agendamento começa.
      const startIndex = times.indexOf(appointment.time);

      // Se encontrou o index
      if (startIndex !== -1) {
        for (let i = 0; i < requiredSlots; i++) {
          const slotIndex = startIndex + i;

          if (slotIndex < times.length) {
            //occupantMap["11:00"] = appointment
            occupantMap[times[slotIndex]] = appointment;
          }
        }
      }
    }
  }

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl md:text-2xl font-bold">
            Agendamentos
          </CardTitle>

          <button>Selecionar data</button>
        </CardHeader>

        <CardContent>
          <ScrollArea className="h-[calc(100% - 20rem)] lg:h-[calc(100%-15rem)] pr-4">
            {isLoading ? (
              <LoadingSpinner fullscreen={false} />
            ) : times.length > 0 ? (
              times.map((slot) => {
                // ocupantMap["15:00"]
                const occupant = occupantMap[slot];

                if (occupant) {
                  alert(occupant.phone);
                  return (
                    <div
                      key={slot}
                      className="flex items-center py-2 border-b last:border-b-0"
                    >
                      <div className="w-16 text-sm font-semibold">{slot}</div>
                      <div className="flex-1">{occupant.name}</div>
                    </div>
                  );
                }

                return (
                  <div
                    key={slot}
                    className="flex items-center py-2 border-b last:border-b-0"
                  >
                    <div className="w-16 text-sm font-semibold">{slot}</div>
                    <div className="flex-1">Disponivel</div>
                  </div>
                );
              })
            ) : (
              <p className="text-foreground text-sm md:text-base">
                Nenhum horário configurado no momento. Acesse seu perfil para
                adicionar e visualizar aqui.
              </p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
