"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { consultants } from "@/lib/consultants-data";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { getAvailableTimeSlots } from "@/lib/actions";

interface ConsultantSelectorProps {
  selectedConsultant?: string;
  onConsultantSelect: (consultantId: string) => void;
  date: Date;
  time: string;
}

export function ConsultantSelector({
  selectedConsultant,
  onConsultantSelect,
  date,
  time
}: ConsultantSelectorProps) {
  const [availableConsultants, setAvailableConsultants] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAvailability() {
      setIsLoading(true);
      const available: string[] = [];

      try {
        // Check each consultant's availability for the selected time
        for (const consultant of consultants) {
          const slots = await getAvailableTimeSlots(date.toISOString(), consultant.id);
          if (slots.includes(time)) {
            available.push(consultant.id);
          }
        }
        setAvailableConsultants(available);
      } catch (error) {
        console.error('Failed to check consultant availability:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (date && time) {
      checkAvailability();
    }
  }, [date, time]);

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {consultants.map((consultant) => {
        const isAvailable = availableConsultants.includes(consultant.id);
        
        return (
          <Card
            key={consultant.id}
            className={`p-4 transition-all ${
              !isAvailable ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            } ${
              selectedConsultant === consultant.id
                ? "border-primary shadow-lg"
                : "hover:border-primary/50"
            }`}
            onClick={() => isAvailable && onConsultantSelect(consultant.id)}
          >
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={consultant.avatar} />
                <AvatarFallback>{consultant.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{consultant.name}</h3>
                <p className="text-sm text-muted-foreground">{consultant.role}</p>
                {!isAvailable && (
                  <p className="text-sm text-red-500">Unavailable</p>
                )}
              </div>
            </div>
          </Card>
        )}
      )}
    </div>
  );
}