"use server";

import { z } from "zod";

// Use the same schema as in the client-side form
const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  mobile: z.string().min(10, "Invalid phone number"),
  country: z.string().min(1, "Please select a country"),
  package: z.string().min(1, "Please select a package"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function saveContactForm(data: z.infer<typeof formSchema>) {
  try {
    // Validate the data again on the server side
    const validatedData = formSchema.parse(data);

    // Save to database
    const savedContact = await prisma.contactForm.create({
      data: {
        fullName: validatedData.fullName,
        email: validatedData.email,
        mobile: validatedData.mobile,
        country: validatedData.country,
        package: validatedData.package,
        message: validatedData.message,
        submittedAt: new Date(),
      },
    });

    return { success: true, id: savedContact.id };
  } catch (error) {
    console.error("Error saving contact form:", error);
    
    // Handle different types of errors
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: "Invalid form data. Please check your inputs." 
      };
    }

    return { 
      success: false, 
      error: "An unexpected error occurred while saving the form." 
    };
  }
}