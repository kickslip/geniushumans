// lib/actions.ts
"use server";

import { z } from "zod";
import { format, parseISO, addDays } from "date-fns";
import { revalidatePath } from "next/cache";
import { db } from "./db";

// Constants
const BUSINESS_HOURS = {
  start: 9, // 9 AM
  end: 17, // 5 PM
};
const BOOKING_WINDOW_DAYS = 30;
const MAX_BOOKINGS_PER_DAY = 3;

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
  company: z.string().min(2, "Company name must be at least 2 characters"),
  message: z.string().optional(),
});

export async function getAvailableTimeSlots(
  dateString: string,
  consultantId: string
): Promise<string[]> {
  const bookingDate = parseISO(dateString);

  // Generate all possible time slots during business hours
  const timeSlots = Array.from(
    { length: BUSINESS_HOURS.end - BUSINESS_HOURS.start },
    (_, i) => {
      const hour = (BUSINESS_HOURS.start + i).toString().padStart(2, "0");
      return `${hour}:00`;
    }
  );

  // Check existing bookings for this date and consultant
  const bookedSlots = await db.booking.findMany({
    where: {
      date: {
        gte: new Date(bookingDate.setHours(0, 0, 0, 0)),
        lt: new Date(bookingDate.setHours(23, 59, 59, 999)),
      },
      consultant: consultantId,
      status: {
        in: ["PENDING", "CONFIRMED"],
      },
    },
    select: { time: true },
  });

  // Remove booked slots and slots with max bookings
  const availableSlots = timeSlots.filter((slot) => {
    const slotBookings = bookedSlots.filter((booking) => booking.time === slot);
    return slotBookings.length < MAX_BOOKINGS_PER_DAY;
  });

  return availableSlots;
}

export async function createBooking(prevState: any, formData: FormData) {
  // Validate input fields
  const validatedFields = BookingSchema.safeParse({
    date: new Date(formData.get("date") as string),
    time: formData.get("time"),
    consultant: formData.get("consultant"),
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company"),
    message: formData.get("message") || undefined,
  });

  // Check validation
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing or invalid fields. Booking failed.",
    };
  }

  const { date, time, consultant, name, email, company, message } =
    validatedFields.data;

  try {
    // Additional date validation
    const today = new Date();
    const maxBookingDate = addDays(today, BOOKING_WINDOW_DAYS);

    if (date < today || date > maxBookingDate) {
      return {
        success: false,
        message: `Bookings must be made between today and ${format(
          maxBookingDate,
          "MMM do, yyyy"
        )}`,
      };
    }

    // Check consultant availability for this time slot
    const existingBookings = await db.booking.count({
      where: {
        date,
        time,
        consultant,
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
      },
    });

    if (existingBookings >= MAX_BOOKINGS_PER_DAY) {
      return {
        success: false,
        message: "Selected time slot is no longer available",
      };
    }

    // Create or find user
    const user = await db.user.upsert({
      where: { email },
      update: {},
      create: {
        username: name.toLowerCase().replace(/\s+/g, "_"),
        email,
        passwordHash: "placeholder", // In a real app, handle password securely
        phoneNumber: "N/A",
      },
    });

    // Create booking
    const booking = await db.booking.create({
      data: {
        userId: user.id,
        date,
        time,
        consultant,
        status: "PENDING",
        name,
        email,
      },
    });

    // Revalidate paths to refresh server-side rendering
    revalidatePath("/book");
    revalidatePath("/dashboard/bookings");

    return {
      success: true,
      bookingId: booking.id,
      message: `Booking confirmed for ${format(
        date,
        "MMMM do, yyyy"
      )} at ${time}`,
    };
  } catch (error) {
    console.error("Booking creation error:", error);
    return {
      success: false,
      message: "Failed to create booking. Please try again.",
    };
  }
}


// Validation schema for project creation  title: z.string().min(3, "Title must be at least 3 characters"),


// Validation schema for project update
const ProjectUpdateSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3, "Title must be at least 3 characters").optional(),
  description: z.string().optional(),
  status: z.enum(["NEW", "IN_PROGRESS", "COMPLETED"]).optional(),
});

// export async function createProject(formData: FormData) {
//   try {
//     // Validate input 
//     const validatedFields = ProjectSchema.safeParse({
//       title: formData.get('title'),
//       description: formData.get('description'),
//       userId: formData.get('userId'),
//     });

//     if (!validatedFields.success) {
//       return {
//         success: false,
//         message: "Invalid input",
//         errors: validatedFields.error.flatten().fieldErrors
//       };
//     }

//     // Create project
//     const project = await db.project.create({
//       data: {
//         title: validatedFields.data.title,
//         description: validatedFields.data.description,
//         userId: validatedFields.data.userId,
//       }
//     });

//     // Revalidate path to refresh server-side rendering
//     revalidatePath('/projects');

//     return {
//       success: true,
//       message: "Project created successfully",
//       project
//     };
//   } catch (error) {
//     console.error("Failed to create project:", error);
//     return {
//       success: false,
//       message: "Failed to create project"
//     };
//   }
// }

// export async function updateProjectStatus(formData: FormData) {
//   try {
//     const validatedFields = ProjectUpdateSchema.safeParse({
//       id: formData.get('id'),
//       status: formData.get('status') as any,
//     });

//     if (!validatedFields.success) {
//       return {
//         success: false,
//         message: "Invalid input",
//         errors: validatedFields.error.flatten().fieldErrors
//       };
//     }

//     const { id, status } = validatedFields.data;

//     // Update project status
//     const updatedProject = await db.project.update({
//       where: { id },
//       data: { status }
//     });

//     // Revalidate path to refresh server-side rendering
//     revalidatePath('/projects');

//     return {
//       success: true,
//       message: "Project status updated successfully",
//       project: updatedProject
//     };
//   } catch (error) {
//     console.error("Failed to update project status:", error);
//     return {
//       success: false,
//       message: "Failed to update project status"
//     };
//   }
// }

// export async function deleteProject(formData: FormData) {
//   try {
//     const id = formData.get('id') as string;

//     // Delete project
//     await db.project.delete({
//       where: { id }
//     });

//     // Revalidate path to refresh server-side rendering
//     revalidatePath('/projects');

//     return {
//       success: true,
//       message: "Project deleted successfully"
//     };
//   } catch (error) {
//     console.error("Failed to delete project:", error);
//     return {
//       success: false,
//       message: "Failed to delete project"
//     };
//   }
// }

// export async function fetchProjects(userId: string) {
//   try {
//     const projects = await db.project.findMany({
//       where: { userId },
//       orderBy: { createdAt: 'desc' }
//     });

//     return {
//       success: true,
//       projects
//     };
//   } catch (error) {
//     console.error("Failed to fetch projects:", error);
//     return {
//       success: false,
//       projects: []
//     };
//   }
// }