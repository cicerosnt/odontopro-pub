"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { error } from "console";
import { useSearchParams } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export const GET = auth(async function GET(request) {
  if (!request.auth) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const dateString = searchParams.get("date") as string;
  const clinicId = request.auth.user.id;

  if (!dateString) {
    return NextResponse.json({ error: "Data não informada!" }, { status: 400 });
  }

  if (!clinicId) {
    return NextResponse.json(
      { error: "Usuário não encontrado." },
      { status: 400 },
    );
  }

  try {
    // criar data formatada
    const [yearStr, monthStr, dayStr] = dateString.split("-");
    const year = Number(yearStr);
    const month = Number(monthStr);
    const day = Number(dayStr);

    if (
      isNaN(year) ||
      isNaN(month) ||
      isNaN(day) ||
      yearStr.length !== 4 ||
      month < 1 ||
      month > 12 ||
      day < 1 ||
      day > 31
    ) {
      return NextResponse.json({ error: "Data inválida!" }, { status: 400 });
    }

    const startDate = new Date(year, month - 1, day, 0, 0, 0, 0);
    const endDate = new Date(year, month - 1, day, 23, 59, 59, 999);

    const appointment = await prisma.appointment.findMany({
      where: {
        userId: request.auth.user.id,
        appointmentDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        service: true,
      },
    });

    console.log("APPOINTMENTE-DASH: ", appointment);

    return NextResponse.json({ appointment }, { status: 200 });
  } catch (err) {
    // console.log(err)
    return NextResponse.json(
      { error: "Falha ao buscar os agendamentos." },
      { status: 400 },
    );
  }
});
