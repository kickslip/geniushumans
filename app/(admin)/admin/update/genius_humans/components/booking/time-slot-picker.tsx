"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getAvailableTimeSlots } from "@/lib/actions";
import { Skeleton } from "@/components/ui/skeleton";

interface TimeSlotPickerProps {
  selectedTime?: string;
  onTimeSelect: (time: string) => void;
  date: Date;
  consultant?: string;
}

export function TimeSlotPicker({ 
  selectedTime, 
  onTimeSelect, 
  date,
  consultant 
}: TimeSlotPickerProps) {
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAvailableSlots() {
      if (!date || !consultant) {
        setAvailableSlots([]);
        setIsLoading(false);
        return;
      }

      try {
        const slots = await getAvailableTimeSlots(date.toISOString(), consultant);
        setAvailableSlots(slots);
      } catch (error) {
        console.error('Failed to fetch available slots:', error);
        setAvailableSlots([]);
      } finally {
        setIsLoading(false);
      }
    }

    setIsLoading(true);
    fetchAvailableSlots();
  }, [date, consultant]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
        {[...Array(7)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (availableSlots.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No available time slots for this date
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
      {availableSlots.map((time) => (
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