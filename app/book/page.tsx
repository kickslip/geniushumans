//app/book/page.tsx
"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { TimeSlotPicker } from "@/components/booking/time-slot-picker";
import { ConsultantSelector } from "@/components/booking/consultant-selector";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useSession } from "@/app/SessionProvider";
import { toast } from "sonner";
import { createBooking } from "@/lib/actions"; // We'll create this server action

export default function BookPage() {
  const { session, user } = useSession();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [selectedConsultant, setSelectedConsultant] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBooking = async () => {
    if (!session) {
      toast.error("You must be logged in to book a consultation");
      return;
    }

    if (!date || !selectedTime || !selectedConsultant) {
      toast.error("Please complete all booking details");
      return;
    }

    setIsSubmitting(true);

    try {
      await createBooking({
        userId: user.id,
        date: date.toISOString(),
        time: selectedTime,
        consultant: selectedConsultant
      });

      toast.success("Consultation booked successfully!");
      
      // Reset form after successful booking
      setDate(undefined);
      setSelectedTime(undefined);
      setSelectedConsultant(undefined);
    } catch (error) {
      toast.error("Failed to book consultation. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return (
      <main className="container mx-auto py-10 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Please log in to book a consultation</h1>
      </main>
    );
  }

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
            <div>
              <Button 
                onClick={handleBooking} 
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? "Booking..." : "Confirm Booking"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}