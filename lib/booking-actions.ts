// lib/booking-actions.ts
"use server";

import { db } from "./db";
import { format } from "date-fns";

export async function getBookingSummary(month?: string) {
  try {
    // If no month is provided, use current month
    const targetMonth = month || format(new Date(), 'yyyy-MM');

    // Parse the month string
    const [year, monthNum] = targetMonth.split('-').map(Number);
    
    // Create date range for the specified month
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0);

    // Fetch total bookings for the month
    const totalBookings = await db.booking.count({
      where: {
        date: {
          gte: startDate,
          lte: endDate
        }
      }
    });

    // Fetch pending bookings for the month
    const pendingBookings = await db.booking.count({
      where: {
        date: {
          gte: startDate,
          lte: endDate
        },
        status: 'PENDING'
      }
    });

    // Fetch confirmed bookings for the month
    const confirmedBookings = await db.booking.count({
      where: {
        date: {
          gte: startDate,
          lte: endDate
        },
        status: 'CONFIRMED'
      }
    });

    return {
      totalBookings,
      pendingBookings,
      confirmedBookings
    };
  } catch (error) {
    console.error('Failed to fetch booking summary:', error);
    return {
      totalBookings: 0,
      pendingBookings: 0,
      confirmedBookings: 0
    };
  }
}

export async function getBookingSummaryByConsultant(month?: string) {
  try {
    // If no month is provided, use current month
    const targetMonth = month || format(new Date(), 'yyyy-MM');

    // Parse the month string
    const [year, monthNum] = targetMonth.split('-').map(Number);
    
    // Create date range for the specified month
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0);

    // Fetch bookings grouped by consultant
    const consultantBookings = await db.booking.groupBy({
      by: ['consultant', 'status'],
      where: {
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      _count: {
        id: true
      }
    });

    // Transform the results into a more readable format
    const summary = consultantBookings.reduce((acc, booking) => {
      if (!acc[booking.consultant]) {
        acc[booking.consultant] = {
          total: 0,
          pending: 0,
          confirmed: 0
        };
      }

      const count = booking._count.id;
      acc[booking.consultant].total += count;

      if (booking.status === 'PENDING') {
        acc[booking.consultant].pending += count;
      } else if (booking.status === 'CONFIRMED') {
        acc[booking.consultant].confirmed += count;
      }

      return acc;
    }, {} as Record<string, { total: number; pending: number; confirmed: number }>);

    return summary;
  } catch (error) {
    console.error('Failed to fetch consultant booking summary:', error);
    return {};
  }
}