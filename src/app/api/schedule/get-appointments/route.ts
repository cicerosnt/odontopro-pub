import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){

    const {searchParams} = request.nextUrl
    
    const userId = searchParams.get('userId')
    const dateParam = searchParams.get('date')
    
    if(!userId || userId === "null" || !dateParam || dateParam === "null"){
        return NextResponse.json({
            error: "Nenhum agendamento encontrado."
        }, {
            status: 400 // bad request
        })
    }
    
    try {
        const [year, month, day] = dateParam.split("-").map(Number)
        const startDate = new Date(year, month - 1, day, 0, 0, 0)
        const endDate = new Date(year, month - 1, day, 23, 59, 59, 999)
        
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })
        
        if(!userId) {
            return NextResponse.json({
                error: "Nenhum agendamento encontrado"
            }, {
                status: 400
            })    
        }
        
        const appointment = await prisma.appointment.findMany({
            where: {
                userId: userId,
                appointmentDate: {
                    gte: startDate,
                    lte: endDate
                }
            },
            include: {
                service: true
            }
        })
        
        // mostrar slots dos agendamentos ocupados
        const blockedSlots = new Set<string>()
        
        for(const apt of appointment){
            // ex.: apt.time = "10:00", apt.service.duratio = 60 (1h)
            const requiredSlots = Math.ceil(apt.service.duration / 30)
            const startIndex = user?.times.indexOf(apt.time)
            
            if (typeof startIndex === "number" && startIndex !== -1) {
                for(let i = 0; i < requiredSlots; i++){
                    // percorre enquanto for a quantidade de slots necessarias
                    const blockedSlot = user?.times[startIndex + i]
                    if (blockedSlot !== undefined) {
                        blockedSlots.add(blockedSlot)
                    }
                }
            }
        }
        
        const blockedTimes = Array.from(blockedSlots)
        
        console.log("BLOCKED-TIMES", blockedTimes)
        
        return NextResponse.json({
            blockedTimes
        })
    }catch(err){
        //console.log(err)
        return NextResponse.json({
            error: "Nenhum agendamento encontrado."
        }, {
            status: 400 // bad request
        })
    }

    
}
