"use server";

import { z } from "zod";
import  prisma  from "@prisma/client";
import { db } from "./db";

const ContactFormSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  mobile: z.string().min(10, "Invalid phone number"),
  country: z.string().min(1, "Please select a country"),
  package: z.string().min(1, "Please select a package"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function saveContactForm(formData: z.infer<typeof ContactFormSchema>) {
  try {
    // Validate input
    const validatedFields = ContactFormSchema.safeParse(formData);

    if (!validatedFields.success) {
      return {
        success: false,
        error: validatedFields.error.flatten().fieldErrors,
      };
    }

    // Save to database
    await db.contactForm.create({
      data: {
        fullName: formData.fullName,
        email: formData.email,
        mobile: formData.mobile,
        country: formData.country,
        package: formData.package,
        message: formData.message,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Contact form submission error:", error);
    return {
      success: false,
      error: "Failed to submit contact form",
    };
  }
}