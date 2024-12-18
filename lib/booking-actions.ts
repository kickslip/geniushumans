// lib/booking-actions.ts
"use server";

import { prisma } from '@/prisma/client';
import { validateRequest } from "@/auth";
import { revalidatePath } from 'next/cache';
import { BookingStatus } from '@prisma/client';
import { format } from 'date-fns';

export async function createBooking(bookingData: {
  date: Date;
  time: string;
  consultant: string;
  name: string;
  email: string;
  company?: string;
  message?: string;
}) {
  try {
    const session = await validateRequest();
    
    if (!session || !session.user) {
      throw new Error('Unauthorized');
    }

    // Create booking with initial status as PENDING
    const newBooking = await prisma.booking.create({
      data: {
        ...bookingData,
        userId: session.user.id,
        status: 'PENDING', // Always start as PENDING
      }
    });

    // Revalidate the path to refresh the data
    revalidatePath('/dashboard/bookings');

    return {
      success: true,
      booking: newBooking
    };
  } catch (error) {
    console.error('Error creating booking:', error);
    return {
      success: false,
      message: 'Failed to create booking'
    };
  }
}

export async function fetchUserBookings() {
  try {
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
      status: booking.status, // Ensure status is returned
      company: booking.company || undefined,
      message: booking.message || undefined
    }));
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }
}

// Server action to confirm booking by admin
export async function confirmBookingByAdmin(bookingId: string) {
  try {
    const session = await validateRequest();
    
    // Optional: Add admin role check
    // if (!session || session.user.role !== 'ADMIN') {
    //   throw new Error('Unauthorized');
    // }

    // Update booking status to CONFIRMED
    const updatedBooking = await prisma.booking.update({
      where: { 
        id: bookingId
      },
      data: { 
        status: 'CONFIRMED' 
      }
    });

    // Revalidate paths to refresh data
    revalidatePath('/dashboard/bookings');
    revalidatePath('/admin/bookings');

    return {
      success: true,
      booking: updatedBooking
    };
  } catch (error) {
    console.error('Error confirming booking:', error);
    return {
      success: false,
      message: 'Failed to confirm booking'
    };
  }
}
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

export async function getBookingSummaryByConsultant(month?: string) {
  try {
    // If no month is provided, use current month
    const targetMonth = month || format(new Date(), "yyyy-MM");

    // Parse the month string
    const [year, monthNum] = targetMonth.split("-").map(Number);

    // Create date range for the specified month
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0);

    // Fetch bookings grouped by consultant and status
    const consultantBookings = await prisma.booking.groupBy({
      by: ["consultant", "status"],
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