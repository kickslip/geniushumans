"use server";

import prisma from "@/lib/prisma";

interface BookingData {
  userId: string;
  date: string;
  time: string;
  consultant: string;
}

export async function createBooking(data: BookingData) {
  try {
    const booking = await prisma.booking.create({
      data: {
        userId: data.userId,
        date: new Date(data.date),
        time: data.time,
        consultant: data.consultant
      }
    });
    return booking;
  } catch (error) {
    console.error("Booking creation error:", error);
    throw new Error("Failed to create booking");
  }
}