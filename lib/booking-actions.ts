"use server";

import { z } from "zod";
import { format } from "date-fns";
import { revalidatePath } from "next/cache";
import { prisma } from '@/prisma/client';
import { validateRequest } from "@/auth";

// Constants
const BUSINESS_HOURS = {
  start: 9, // 9 AM
  end: 17, // 5 PM
};

const BOOKING_WINDOW_DAYS = 30;
const MAX_BOOKINGS_PER_DAY = 6;

// Validation schema for booking
const BookingSchema = z.object({
  date: z.date(),
  time: z.string().refine(
    (time) => {
      const [hour] = time.split(":").map(Number);
      return hour >= BUSINESS_HOURS.start && hour < BUSINESS_HOURS.end;
    },
    { message: "Booking time must be during business hours (9 AM - 5 PM)" }
  ),
  consultant: z.string().min(1, "Consultant is required"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  company: z.string().optional(),
  message: z.string().optional(),
});

export async function getBookingSummary(month?: string) {
  try {
    // If no month is provided, use current month
    const targetMonth = month || format(new Date(), "yyyy-MM");

    // Parse the month string
    const [year, monthNum] = targetMonth.split("-").map(Number);

    // Create date range for the specified month
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0);

    // Fetch bookings grouped by status
    const bookingStats = await prisma.booking.groupBy({
      by: ["status"],
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: {
        id: true,
      },
    });

    // Transform results into a more readable format
    const summary = bookingStats.reduce(
      (acc, booking) => {
        switch (booking.status) {
          case "PENDING":
            acc.pendingBookings = booking._count.id;
            break;
          case "CONFIRMED":
            acc.confirmedBookings = booking._count.id;
            break;
          default:
            break;
        }
        acc.totalBookings = (acc.totalBookings || 0) + booking._count.id;
        return acc;
      },
      {
        totalBookings: 0,
        pendingBookings: 0,
        confirmedBookings: 0,
      }
    );

    return summary;
  } catch (error) {
    console.error("Failed to fetch booking summary:", error);
    return {
      totalBookings: 0,
      pendingBookings: 0,
      confirmedBookings: 0,
    };
  }
}

export async function getBookingSummaryByConsultant(
  consultantId?: string,
  month?: string
) {
  try {
    // If no month is provided, use current month
    const targetMonth = month || format(new Date(), "yyyy-MM");

    // Parse the month string
    const [year, monthNum] = targetMonth.split("-").map(Number);

    // Create date range for the specified month
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0);

    // Prepare where clause
    const whereClause = {
      date: {
        gte: startDate,
        lte: endDate,
      },
      ...(consultantId ? { consultant: consultantId } : {}),
    };

    // Fetch bookings grouped by consultant and status
    const consultantBookings = await prisma.booking.groupBy({
      by: ["consultant", "status"],
      where: whereClause,
      _count: {
        id: true,
      },
    });

    // Transform the results into a more readable format
    const summary = consultantBookings.reduce((acc, booking) => {
      if (!acc[booking.consultant]) {
        acc[booking.consultant] = {
          total: 0,
          pending: 0,
          confirmed: 0,
        };
      }

      const count = booking._count.id;
      acc[booking.consultant].total += count;

      if (booking.status === "PENDING") {
        acc[booking.consultant].pending += count;
      } else if (booking.status === "CONFIRMED") {
        acc[booking.consultant].confirmed += count;
      }

      return acc;
    }, {} as Record<string, { total: number; pending: number; confirmed: number }>);

    return summary;
  } catch (error) {
    console.error("Failed to fetch consultant booking summary:", error);
    return {};
  }
}

// Optional:  more generic summary method
export async function getOverallBookingSummary() {
  try {
    const bookingSummary = await prisma.booking.groupBy({
      by: ["status"],
      _count: {
        id: true,
      },
    });

    return bookingSummary.map((booking) => ({
      status: booking.status,
      count: booking._count.id,
    }));
  } catch (error) {
    console.error("Error fetching overall booking summary:", error);
    return [];
  }
}

export async function fetchUserBookings() {
  try {
    // Get the current authenticated user
    const session = await validateRequest();
    
    if (!session || !session.user) {
      throw new Error('Unauthorized');
    }

    // Fetch bookings for the current user
    const bookings = await prisma.booking.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        date: 'desc' // Most recent bookings first
      }
    });

    return bookings.map(booking => ({
      id: booking.id,
      date: booking.date,
      time: booking.time,
      consultant: booking.consultant,
      status: booking.status,
      company: booking.company || undefined,
      message: booking.message || undefined
    }));
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }
}