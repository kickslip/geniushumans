"use server";

import { z } from "zod";
import { prisma } from '@/prisma/client';

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
    const validatedFields = ContactFormSchema.safeParse(formData);

    if (!validatedFields.success) {
      return {
        success: false,
        error: validatedFields.error.flatten().fieldErrors,
      };
    }

    await prisma.contactForm.create({
      data: {
        ...formData,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Contact form submission error:", error);
    return {
      success: false,
      error: "Failed to submit contact form",
    };
  }
}
