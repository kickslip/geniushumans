"use client";

import { Button } from "@/components/ui/button";

const timeSlots = [
  "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"
];

interface TimeSlotPickerProps {
  selectedTime?: string;
  onTimeSelect: (time: string) => void;
}

export function TimeSlotPicker({ selectedTime, onTimeSelect }: TimeSlotPickerProps) {
  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
      {timeSlots.map((time) => (
        <Button
          key={time}
          variant={selectedTime === time ? "default" : "outline"}
          className="w-full"
          onClick={() => onTimeSelect(time)}
        >
          {time}
        </Button>
      ))}
    </div>
  );
}