"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { TimeSlotPicker } from "@/components/booking/time-slot-picker";
import { ConsultantSelector } from "@/components/booking/consultant-selector";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useSession } from "@/app/SessionProvider";
import { toast } from "sonner";
import { createBooking } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function BookPage() {
  const { session, user } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined
  );
  const [selectedConsultant, setSelectedConsultant] = useState<
    string | undefined
  >(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check session and redirect if not authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!session || !user) {
          router.push("/login");
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/login");
      }
    };

    checkAuth();
  }, [session, user, router]);

  const handleBooking = async () => {
    if (!session || !user) {
      toast.error("You must be logged in to book a consultation");
      router.push("/login");
      return;
    }

    if (!date || !selectedTime || !selectedConsultant) {
      toast.error("Please complete all booking details");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createBooking({
        userId: user.id,
        date: date.toISOString(),
        time: selectedTime,
        consultant: selectedConsultant,
      });

      if (result.success) {
        toast.success("Consultation booked successfully!");
        // Reset form
        setDate(undefined);
        setSelectedTime(undefined);
        setSelectedConsultant(undefined);
      } else {
        toast.error(result.error?.message || "Failed to book consultation");
      }
    } catch (error) {
      console.error("Booking creation failed:", error);
      toast.error("Failed to book consultation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <main className="container mx-auto py-10 px-4">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="grid md:grid-cols-[300px,1fr] gap-8">
          <Skeleton className="h-[350px]" />
          <div className="space-y-8">
            <Skeleton className="h-[200px]" />
            <Skeleton className="h-[200px]" />
          </div>
        </div>
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
            disabled={(date) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return date < today || date.getDay() === 0 || date.getDay() === 6;
            }}
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
                  date={date}
                  consultant={selectedConsultant} // Pass this when you want to show slots for a specific consultant
                />
              </div>
              <Separator />
            </>
          )}

          {date && selectedTime && (
            <>
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Select a Consultant
                </h2>

                <ConsultantSelector
                  selectedConsultant={selectedConsultant}
                  onConsultantSelect={setSelectedConsultant}
                  date={date}
                  time={selectedTime}
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
