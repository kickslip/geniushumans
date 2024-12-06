"use client";

import React, { useState } from 'react';
import { format, addDays } from 'date-fns';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css'; // Important: add this import
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Toaster, toast } from 'sonner';
import { createBooking, getAvailableTimeSlots } from '@/lib/actions';

// Validation schema matching the server-side BookingSchema
const BookingFormSchema = z.object({
  date: z.date(),
  time: z.string().min(1, "Please select a time slot"),
  consultant: z.string().min(1, "Please select a consultant"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  company: z.string().min(2, "Company name must be at least 2 characters"),
  message: z.string().optional(),
});

type BookingFormData = z.infer<typeof BookingFormSchema>;

const BookingComponent: React.FC = () => {
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const { 
    control, 
    register, 
    handleSubmit, 
    setValue, 
    watch, 
    formState: { errors } 
  } = useForm<BookingFormData>({
    resolver: zodResolver(BookingFormSchema),
    defaultValues: {
      consultant: '', // Default empty consultant
    }
  });

  // Consultants list (you can modify this based on your actual consultants)
  const consultants = [
    { id: 'consultant1', name: 'John Doe' },
    { id: 'consultant2', name: 'Jane Smith' },
  ];

  // Watch selected date and consultant to fetch available time slots
  const watchDate = watch('date');
  const watchConsultant = watch('consultant');

  React.useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (watchDate && watchConsultant) {
        try {
          const slots = await getAvailableTimeSlots(
            watchDate.toISOString(), 
            watchConsultant
          );
          setAvailableTimeSlots(slots);
        } catch (error) {
          toast.error('Failed to fetch available time slots');
        }
      }
    };

    fetchAvailableSlots();
  }, [watchDate, watchConsultant]);

  const onSubmit = async (data: BookingFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      // Handle date conversion to string
      formData.append(key, 
        key === 'date' ? (value as Date).toISOString() : 
        value as string
      );
    });

    try {
      const result = await createBooking({}, formData);
      
      if (result.success) {
        toast.success(result.message);
        // Reset form or redirect as needed
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    }
  };

  // Define date restrictions
  const today = new Date();
  const maxBookingDate = addDays(today, 30); // Match BOOKING_WINDOW_DAYS from server action

  return (
    <div className="max-w-md mx-auto p-6 bg-secondary/30 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Book an Appointment</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Date Selection */}
        <div>
          <label className="block mb-2 font-medium">Select Date</label>
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <DayPicker
                mode="single"
                selected={field.value}
                onSelect={(date) => {
                  field.onChange(date);
                  // Reset time when date changes
                  setValue('time', '');
                }}
                disabled={[
                  { before: today },
                  { after: maxBookingDate }
                ]}
                className="rounded-md border "
              />
            )}
          />
          {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
        </div>

        {/* Rest of the component remains the same as in the previous version */}
        {/* Consultant Selection */}
        <div>
          <label className="block mb-2 font-medium">Select Consultant</label>
          <Controller
            name="consultant"
            control={control}
            render={({ field }) => (
              <Select 
                onValueChange={field.onChange}
                value={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a consultant" />
                </SelectTrigger>
                <SelectContent>
                  {consultants.map((consultant) => (
                    <SelectItem 
                      key={consultant.id} 
                      value={consultant.id}
                    >
                      {consultant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.consultant && <p className="text-red-500 text-sm">{errors.consultant.message}</p>}
        </div>

        {/* Time Slot Selection */}
        {watchDate && watchConsultant && (
          <div>
            <label className="block mb-2 font-medium">Select Time Slot</label>
            <Controller
              name="time"
              control={control}
              render={({ field }) => (
                <Select 
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTimeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.time && <p className="text-red-500 text-sm">{errors.time.message}</p>}
          </div>
        )}

        {/* Personal Details */}
        <div>
          <label className="block mb-2 font-medium">Name</label>
          <Input 
            {...register('name')}
            placeholder="Your full name" 
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block mb-2 font-medium">Email</label>
          <Input 
            {...register('email')}
            placeholder="your.email@example.com" 
            type="email"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block mb-2 font-medium">Company</label>
          <Input 
            {...register('company')}
            placeholder="Your company name" 
          />
          {errors.company && <p className="text-red-500 text-sm">{errors.company.message}</p>}
        </div>

        <div>
          <label className="block mb-2 font-medium">Optional Message</label>
          <Input 
            {...register('message')}
            placeholder="Any additional details" 
          />
        </div>

        <Button 
          type="submit" 
          className="w-full"
        >
          Book Appointment
        </Button>
      </form>
      
      <Toaster />
    </div>
  );
};

export default BookingComponent;