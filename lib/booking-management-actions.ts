// lib/booking-management-actions.ts
"use server";

import { prisma } from '@/prisma/client';
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { BookingStatus } from "@prisma/client";

// Validation schema for booking update
const BookingUpdateSchema = z.object({
  id: z.string().uuid(),
  status: z.nativeEnum(BookingStatus).optional(),
  consultant: z.string().optional(),
  message: z.string().optional(),
  company: z.string().optional(),
  name: z.string().optional()
});


// Function to update booking dates and times
export async function updateBookingDateTime(
  bookingId: string,
  newDate?: Date,
  newTime?: string,
) {
  try {
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        ...(newDate && { date: newDate }),
        ...(newTime && { time: newTime }),
        updatedAt: new Date(),
      },
    });
    return booking;
  } catch (error) {
    console.error('Failed to update booking date/time:', error);
    throw error;
  }
}

// Enhanced version of getDetailedBookings with more date filtering options
export async function getDetailedBookings(
  month?: string,
  consultant?: string,
  dateRange?: { start: Date; end: Date }
) {
  try {
    // If specific date range is provided, use it
    // Otherwise, if month is provided, use month range
    // If neither, use current month
    let startDate: Date;
    let endDate: Date;

    if (dateRange) {
      startDate = dateRange.start;
      endDate = dateRange.end;
    } else {
      const targetMonth = month || new Date().toISOString().slice(0, 7);
      const [year, monthNum] = targetMonth.split('-').map(Number);
      startDate = new Date(year, monthNum - 1, 1);
      endDate = new Date(year, monthNum, 0);
    }

    // Set time to start and end of day respectively
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    const bookings = await prisma.booking.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
        ...(consultant && consultant !== 'all' 
          ? { consultant } 
          : {})
      },
      include: {
        user: true
      },
      orderBy: {
        date: 'desc'
      }
    });

    // Transform bookings to include more details and date formatting
    return bookings.map(booking => ({
      id: booking.id,
      date: booking.date,
      formattedDate: booking.date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: booking.time,
      consultant: booking.consultant,
      status: booking.status,
      user: {
        name: booking.user.username,
        email: booking.user.email,
        company: booking.user.company || 'N/A'
      },
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      lastModified: booking.updatedAt.toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      })
    }));
  } catch (error) {
    console.error('Failed to fetch detailed bookings:', error);
    return [];
  }
}

// Helper function to validate date ranges
export async function validateDateRange(startDate: Date, endDate: Date): Promise<boolean> {
  const now = new Date();
  return (
    startDate instanceof Date &&
    endDate instanceof Date &&
    !isNaN(startDate.getTime()) &&
    !isNaN(endDate.getTime()) &&
    startDate <= endDate &&
    startDate >= new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()) // Limit to 1 year in the past
  );
}

export async function updateBookingStatus(
  formData: FormData
) {
  try {
    const validatedFields = BookingUpdateSchema.safeParse({
      id: formData.get('id')?.toString(),
      status: formData.get('status')?.toString() as BookingStatus | undefined,
    });

    if (!validatedFields.success) {
      return {
        success: false,
        message: 'Invalid input. Please check your data.',
        errors: validatedFields.error.flatten().fieldErrors
      };
    }

    const { id, status } = validatedFields.data;

    // Update booking
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        status: status
      }
    });

    // Revalidate paths to refresh server-side rendering
    revalidatePath('/dashboard/bookings');

    return {
      success: true,
      message: 'Booking updated successfully',
      booking: updatedBooking
    };
  } catch (error) {
    console.error('Failed to update booking:', error);
    return {
      success: false,
      message: 'Failed to update booking. Please try again.'
    };
  }
}

export async function deleteBooking(bookingId: string) {
  try {
    // Verify the booking exists before deletion
    const existingBooking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!existingBooking) {
      return {
        success: false,
        message: 'Booking not found'
      };
    }

    // Delete associated records (if any) first
    // For example, if you have related payments or notifications:
    // await prisma.payment.deleteMany({ where: { bookingId } });
    // await prisma.notification.deleteMany({ where: { bookingId } });

    // Delete the booking
    await prisma.booking.delete({
      where: { id: bookingId }
    });

    // Revalidate paths to refresh server-side rendering
    revalidatePath('/dashboard/bookings');
    revalidatePath(`/dashboard/bookings/${bookingId}`);

    return {
      success: true,
      message: 'Booking deleted successfully'
    };
  } catch (error) {
    console.error('Failed to delete booking:', error);
    
    // Check if it's a Prisma error and provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('Foreign key constraint failed')) {
        return {
          success: false,
          message: 'Cannot delete booking because it has related records'
        };
      }
      
      if (error.message.includes('Record to delete does not exist')) {
        return {
          success: false,
          message: 'Booking not found'
        };
      }
    }

    return {
      success: false,
      message: 'Failed to delete booking. Please try again.'
    };
  }
}

export async function getBookingSummary() {
  try {
    const totalBookings = await prisma.booking.count();
    const pendingBookings = await prisma.booking.count({
      where: { status: 'PENDING' }
    });
    const confirmedBookings = await prisma.booking.count({
      where: { status: 'CONFIRMED' }
    });
    const cancelledBookings = await prisma.booking.count({
      where: { status: 'CANCELLED' }
    });

    return {
      total: totalBookings,
      pending: pendingBookings,
      confirmed: confirmedBookings,
      cancelled: cancelledBookings
    };
  } catch (error) {
    console.error("Error fetching booking summary:", error);
    throw new Error("Failed to fetch booking summary");
  }
}