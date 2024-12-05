// lib/booking-management-actions.ts
"use server";

import { db } from "./db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { BookingStatus } from "@prisma/client";

// Validation schema for booking update
const BookingUpdateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED']).optional(),
  consultant: z.string().optional(),
  message: z.string().optional(),
  company: z.string().optional()
});

export async function getDetailedBookings(
  month?: string, 
  consultant?: string
) {
  try {
    // If no month is provided, use current month
    const targetMonth = month || new Date().toISOString().slice(0, 7);

    // Parse the month string
    const [year, monthNum] = targetMonth.split('-').map(Number);
    
    // Create date range for the specified month
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0);

    // Fetch detailed bookings
    const bookings = await db.booking.findMany({
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
        user: true // Include user details
      },
      orderBy: {
        date: 'desc'
      }
    });

    // Transform bookings to include more details
    return bookings.map(booking => ({
      id: booking.id,
      date: booking.date,
      time: booking.time,
      consultant: booking.consultant,
      status: booking.status,
      user: {
        name: booking.user.username,
        email: booking.user.email,
        company: booking.user.company || 'N/A'
      },
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt
    }));
  } catch (error) {
    console.error('Failed to fetch detailed bookings:', error);
    return [];
  }
}

export async function updateBookingStatus(
  formData: FormData
) {
  try {
    const validatedFields = BookingUpdateSchema.safeParse({
      id: formData.get('id'),
      status: formData.get('status') as any,
      consultant: formData.get('consultant') as string | undefined,
      message: formData.get('message') as string | undefined
    });

    if (!validatedFields.success) {
      return {
        success: false,
        message: 'Invalid input. Please check your data.',
        errors: validatedFields.error.flatten().fieldErrors
      };
    }

    const { id, status, consultant, message } = validatedFields.data;

    // Update booking
    const updatedBooking = await db.booking.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(consultant ? { consultant } : {}),
        ...(message ? { message } : {})
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
    await db.booking.delete({
      where: { id: bookingId }
    });

    // Revalidate paths to refresh server-side rendering
    revalidatePath('/dashboard/bookings');

    return {
      success: true,
      message: 'Booking deleted successfully'
    };
  } catch (error) {
    console.error('Failed to delete booking:', error);
    return {
      success: false,
      message: 'Failed to delete booking. Please try again.'
    };
  }
}

export async function getBookingSummary() {
  try {
    const totalBookings = await db.booking.count();
    const pendingBookings = await db.booking.count({
      where: { status: 'PENDING' }
    });
    const confirmedBookings = await db.booking.count({
      where: { status: 'CONFIRMED' }
    });
    const cancelledBookings = await db.booking.count({
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