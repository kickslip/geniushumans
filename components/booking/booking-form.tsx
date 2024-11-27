"use client";

import { useState } from "react";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { consultants } from "@/lib/consultants-data";
import { createBooking } from "@/lib/actions";
import { useSession } from "@/app/SessionProvider"; // Assuming you have a session hook

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  company: z.string().min(2, "Company name must be at least 2 characters"),
  message: z.string().optional(),
});

interface BookingFormProps {
  date: Date;
  time: string;
  consultant: string;
  onSuccess?: () => void;
}

export function BookingForm({ 
  date, 
  time, 
  consultant, 
  onSuccess 
}: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useSession(); // Get current user from session
  const selectedConsultant = consultants.find((c) => c.id === consultant);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.username || "",
      email: user?.email || "",
      company: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to book a consultation.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await createBooking({
        userId: user.id,
        date,
        time,
        consultant
      });

      toast({
        title: "Consultation Scheduled!",
        description: "You'll receive a confirmation email with the Google Meet link shortly.",
      });

      // Call onSuccess callback if provided
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "Unable to schedule consultation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="p-4 bg-secondary/30 rounded-lg">
        <h3 className="font-medium mb-2">Booking Summary</h3>
        <p className="text-sm text-muted-foreground">
          {format(date, "MMMM do, yyyy")} at {time}
        </p>
        <p className="text-sm text-muted-foreground">
          with {selectedConsultant?.name} ({selectedConsultant?.role})
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Form fields remain the same as in your original code */}
          {/* ... */}
        </form>
      </Form>
    </div>
  );
}