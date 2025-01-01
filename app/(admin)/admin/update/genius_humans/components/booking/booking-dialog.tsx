"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { TimeSlotPicker } from "@/components/booking/time-slot-picker";
import { ConsultantSelector } from "@/components/booking/consultant-selector";
import { BookingForm } from "@/components/booking/booking-form";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface BookingDialogProps {
  children: React.ReactNode;
}

export function BookingDialog({ children }: BookingDialogProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [selectedConsultant, setSelectedConsultant] = useState<string | undefined>(undefined);
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    resetSelection();
  };

  const resetSelection = () => {
    setDate(undefined);
    setSelectedTime(undefined);
    setSelectedConsultant(undefined);
  };

  const disabledDays = (date: Date) => {
    const today = new Date();
    return (
      date < today || 
      date.getDay() === 0 || // Disable Sundays
      date.getDay() === 6    // Disable Saturdays
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Schedule a Consultation</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <div className="mt-4 space-y-8">
          <div>
            <h3 className="font-medium mb-4">Select a Date</h3>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(selectedDate) => {
                // Ensure the selected date is valid and not disabled
                if (selectedDate && !disabledDays(selectedDate)) {
                  setDate(selectedDate);
                  // Reset dependent selections when date changes
                  setSelectedTime(undefined);
                  setSelectedConsultant(undefined);
                }
              }}
              disabled={disabledDays}
              className="rounded-md mx-auto"
            />
          </div>

          {date && (
            <div>
              <h3 className="font-medium mb-4">Select a Time</h3>
              <TimeSlotPicker
                selectedTime={selectedTime}
                onTimeSelect={setSelectedTime}
                date={date}
              />
            </div>
          )}

          {date && selectedTime && (
            <div>
              <h3 className="font-medium mb-4">Select a Consultant</h3>
              <ConsultantSelector
                selectedConsultant={selectedConsultant}
                onConsultantSelect={setSelectedConsultant}
                date={date}
                time={selectedTime}
              />
            </div>
          )}

          {date && selectedTime && selectedConsultant && (
            <BookingForm
              date={date}
              time={selectedTime}
              consultant={selectedConsultant}
              onSuccess={handleClose}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}