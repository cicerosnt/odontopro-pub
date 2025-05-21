"use client"

import { Button } from "@/components/ui/button";
import { TimeSlot } from "./schedule-content";
import { cn } from "@/lib/utils";
import { isSlotSequenceAvailable, isSlotInThePast, isToDay } from "./schedule-ultils";

interface ScheduleTimeListProps {
    selectedDate: Date;
    selectedTime: string;
    requiredSlots: number;
    blockedTimes: string[];
    availableTimeSlots: TimeSlot[];
    clinicTimes: string[];
    onSelectTime: (time: string) => void
}

export function ScheduleTimeList({
    selectedDate,
    availableTimeSlots,
    blockedTimes,
    clinicTimes,
    requiredSlots,
    selectedTime,
    onSelectTime
}: ScheduleTimeListProps) {

    const dateIsToDay = isToDay(selectedDate)

    return (
        <div className="grid grid-cols-4 md:grid-cols-5 gap-2">
            {availableTimeSlots.map((slot) => {
            
                const sequenceOk = isSlotSequenceAvailable(
                    slot.time,
                    requiredSlots,
                    clinicTimes,
                    blockedTimes
                )
                
                const slotIsPast = dateIsToDay && isSlotInThePast(slot.time)
                
                const slotEnabled = slot.available && sequenceOk && !slotIsPast

                return (
                    <Button
                        onClick={() => slotEnabled && onSelectTime(slot.time)}
                        type="button"
                        variant="outline"
                        key={slot.time}
                        className={cn("h-10 select-none cursor-pointer",
                            selectedTime === slot.time && "border-2 border-emerald-500 text-primary",
                            !slotEnabled && "opacity-50 cursor-not-allowed"
                        )}
                        disabled={!slotEnabled}
                    >
                        {slot.time}
                    </Button>
                )
            })}

        </div>
    )
}
