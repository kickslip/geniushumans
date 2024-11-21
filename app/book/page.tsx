"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { TimeSlotPicker } from "@/components/booking/time-slot-picker";
import { ConsultantSelector } from "@/components/booking/consultant-selector";
import { BookingForm } from "@/components/booking/booking-form";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function BookPage() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [selectedConsultant, setSelectedConsultant] = useState<string | undefined>(undefined);

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Schedule a Consultation</h1>
      <div className="grid md:grid-cols-[300px,1fr] gap-8">
        <Card className="p-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md"
            disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
          />
        </Card>

        <div className="space-y-8">
          {date && (
            <>
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Available Times for {format(date, "MMMM do, yyyy")}
                </h2>
                <TimeSlotPicker
                  selectedTime={selectedTime}
                  onTimeSelect={setSelectedTime}
                />
              </div>
              <Separator />
            </>
          )}

          {date && selectedTime && (
            <>
              <div>
                <h2 className="text-xl font-semibold mb-4">Select a Consultant</h2>
                <ConsultantSelector
                  selectedConsultant={selectedConsultant}
                  onConsultantSelect={setSelectedConsultant}
                />
              </div>
              <Separator />
            </>
          )}

          {date && selectedTime && selectedConsultant && (
            <BookingForm
              date={date}
              time={selectedTime}
              consultant={selectedConsultant}
            />
          )}
        </div>
      </div>
    </main>
  );
}