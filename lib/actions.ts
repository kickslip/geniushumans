// lib/actions.ts
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { isWithinInterval, addDays, parseISO, format } from "date-fns";

interface BookingData {
  userId: string;
  date: string;
  time: string;
  consultant: string;
}

interface BookingError {
  message: string;
  code: string;
}

const BOOKING_WINDOW_DAYS = 30; // How many days in advance bookings are allowed
const MAX_BOOKINGS_PER_DAY = 3; // Maximum bookings per consultant per day
const BUSINESS_HOURS = {
  start: 9, // 9 AM
  end: 17,  // 5 PM
};

export async function createBooking(data: BookingData): Promise<{ success: boolean; error?: BookingError; booking?: any }> {
  try {
    // Input validation
    if (!data.userId || !data.date || !data.time || !data.consultant) {
      return {
        success: false,
        error: {
          message: "Missing required booking information",
          code: "INVALID_INPUT"
        }
      };
    }

    const bookingDate = parseISO(data.date);
    const today = new Date();
    const maxBookingDate = addDays(today, BOOKING_WINDOW_DAYS);

    // Validate booking date
    if (!isWithinInterval(bookingDate, { start: today, end: maxBookingDate })) {
      return {
        success: false,
        error: {
          message: `Bookings must be made between today and ${format(maxBookingDate, 'MMM do, yyyy')}`,
          code: "INVALID_DATE_RANGE"
        }
      };
    }

    // Validate time format and business hours
    const timeHour = parseInt(data.time.split(':')[0]);
    if (timeHour < BUSINESS_HOURS.start || timeHour >= BUSINESS_HOURS.end) {
      return {
        success: false,
        error: {
          message: "Bookings are only available during business hours (9 AM - 5 PM)",
          code: "INVALID_TIME"
        }
      };
    }

    // Check if user already has a booking on the same day
    const existingUserBooking = await prisma.booking.findFirst({
      where: {
        userId: data.userId,
        date: {
          gte: new Date(bookingDate.setHours(0, 0, 0, 0)),
          lt: new Date(bookingDate.setHours(24, 0, 0, 0)),
        },
        status: "PENDING",
      },
    });

    if (existingUserBooking) {
      return {
        success: false,
        error: {
          message: "You already have a booking scheduled for this day",
          code: "DUPLICATE_BOOKING"
        }
      };
    }

    // Check consultant availability
    const consultantBookingsCount = await prisma.booking.count({
      where: {
        consultant: data.consultant,
        date: bookingDate,
        time: data.time,
        status: {
          in: ["PENDING", "CONFIRMED"]
        }
      },
    });

    if (consultantBookingsCount >= MAX_BOOKINGS_PER_DAY) {
      return {
        success: false,
        error: {
          message: "Selected time slot is no longer available",
          code: "TIME_SLOT_UNAVAILABLE"
        }
      };
    }

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        userId: data.userId,
        date: bookingDate,
        time: data.time,
        consultant: data.consultant,
        status: "PENDING"
      },
      include: {
        user: {
          select: {
            email: true,
            username: true,
            phoneNumber: true
          }
        }
      }
    });

    // Revalidate the bookings page to show updated data
    revalidatePath('/book');
    revalidatePath('/dashboard/bookings');

    return {
      success: true,
      booking
    };

  } catch (error) {
    console.error("Booking creation error:", error);
    
    return {
      success: false,
      error: {
        message: "Failed to create booking. Please try again later.",
        code: "SERVER_ERROR"
      }
    };
  }
}

// Helper function to get available time slots
export async function getAvailableTimeSlots(date: string, consultant: string) {
  const bookingDate = parseISO(date);
  
  // Generate all possible time slots
  const timeSlots = [];
  for (let hour = BUSINESS_HOURS.start; hour < BUSINESS_HOURS.end; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
  }

  // Get booked slots
  const bookedSlots = await prisma.booking.findMany({
    where: {
      date: bookingDate,
      consultant,
      status: {
        in: ["PENDING", "CONFIRMED"]
      }
    },
    select: {
      time: true
    }
  });

  const bookedTimes = new Set(bookedSlots.map(slot => slot.time));

  // Return available slots
  return timeSlots.filter(time => !bookedTimes.has(time));
}