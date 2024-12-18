"use client";

import React, { useState } from 'react';
import { format, addDays } from 'date-fns';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Toaster, toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { createBooking, getAvailableTimeSlots } from '@/lib/actions';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingSlots, setIsFetchingSlots] = useState(false);
  
  const { 
    control, 
    register, 
    handleSubmit, 
    setValue, 
    watch,
    reset,
    formState: { errors } 
  } = useForm<BookingFormData>({
    resolver: zodResolver(BookingFormSchema),
    defaultValues: {
      consultant: '',
      date: undefined,
      time: '',
      name: '',
      email: '',
      company: '',
      message: '',
    }
  });

  const consultants = [
    { id: 'consultant1', name: 'John Doe' },
    { id: 'consultant2', name: 'Jane Smith' },
  ];

  const watchDate = watch('date');
  const watchConsultant = watch('consultant');

  React.useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (watchDate && watchConsultant) {
        setIsFetchingSlots(true);
        try {
          const slots = await getAvailableTimeSlots(
            watchDate.toISOString(), 
            watchConsultant
          );
          setAvailableTimeSlots(slots);
        } catch (error) {
          toast.error('Failed to fetch available time slots');
        } finally {
          setIsFetchingSlots(false);
        }
      }
    };

    fetchAvailableSlots();
  }, [watchDate, watchConsultant]);

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, 
        key === 'date' ? (value as Date).toISOString() : 
        value as string
      );
    });

    try {
      const result = await createBooking({}, formData);
      
      if (result.success) {
        // Clear form
        reset({
          consultant: '',
          date: undefined,
          time: '',
          name: '',
          email: '',
          company: '',
          message: '',
        });
        
        // Clear available time slots
        setAvailableTimeSlots([]);
        
        // Show success message
        toast.success(result.message, {
          duration: 5000,
        });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date();
  const maxBookingDate = addDays(today, 30);

  return (
    <div className="max-w-md mx-auto p-6 bg-secondary/30 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Book an Appointment</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                  setValue('time', '');
                }}
                disabled={[
                  { before: today },
                  { after: maxBookingDate }
                ]}
                className="rounded-md border"
              />
            )}
          />
          {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
        </div>

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

        {watchDate && watchConsultant && (
          <div>
            <label className="block mb-2 font-medium">Select Time Slot</label>
            {isFetchingSlots ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
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
            )}
            {errors.time && <p className="text-red-500 text-sm">{errors.time.message}</p>}
          </div>
        )}

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
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Booking...
            </div>
          ) : (
            'Book Appointment'
          )}
        </Button>
      </form>
      
      <Toaster />
    </div>
  );
};

export default BookingComponent;