"use client"
import { ptBR } from 'date-fns/locale/pt-BR'
import { useState } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'

import "react-datepicker/dist/react-datepicker.css"

registerLocale("pt-BR", ptBR)

interface DateTimePickerProps {
    minDate?: Date;
    className?: string;
    maxDate?: Date;
    initialDate?: Date;
    onChange: (date: Date) => void;
}

export function DateTimePicker({ initialDate, className, minDate, maxDate, onChange }: DateTimePickerProps) {

    const [startDate, setStartDate] = useState(initialDate || new Date())
    
    // Define a data máxima como 30 dias a partir de hoje (se maxDate não for fornecida)
      const maxSelectableDate = maxDate ?? new Date((new Date()).getTime() + 30 * 24 * 60 * 60 * 1000)
    
    function handleChange(date: Date | null) {
        if (date) {
          console.log(date);
          setStartDate(date);
          onChange(date)
        }
      }
    
    return (
        <DatePicker
            className={className}
            selected={startDate}   
            locale="pt-BR"
            minDate={minDate ?? new Date()}
            maxDate={maxSelectableDate}
            onChange={handleChange}
            dateFormat="dd/MM/yyyy"
        />
    )    
}
