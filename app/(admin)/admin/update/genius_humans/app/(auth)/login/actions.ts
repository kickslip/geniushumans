"use server";

import { lucia } from "@/auth";
import { prisma } from '@/prisma/client';
import { hash, verify } from "@node-rs/argon2";
import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { User } from "@prisma/client";
import { z } from "zod";
import { randomBytes } from "crypto";
import { loginSchema, LoginValues } from "@/lib/validations";
//import { sendEmail } from "./email";

enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

type RouteResolver = string | ((user: User) => string);

const roleRoutes: Record<UserRole, RouteResolver> = {
  [UserRole.USER]: "/",
  [UserRole.ADMIN]: "/admin",
};

export async function login(
  credentials: LoginValues & { targetPanel?: string }
): Promise<{ error: string } | void> {
  try {
    const { email, password, targetPanel } = credentials;
    const validatedCreds = loginSchema.parse({ email, password });

    const existingUser = await prisma.user.findFirst({
      where: {
        email: {
          equals: validatedCreds.email,
          mode: "insensitive",
        },
      },
    });

    if (!existingUser || !existingUser.passwordHash) {
      return {
        error: "Incorrect email or password",
      };
    }

    const validPassword = await verify(existingUser.passwordHash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    if (!validPassword) {
      return {
        error: "Incorrect email or password",
      };
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    const userRole = existingUser.role as UserRole;

    // Handle routing based on user role
    if (userRole === UserRole.USER) {
      return redirect("/");
    } else {
      const route = roleRoutes[userRole];
      const redirectPath =
        typeof route === "function" ? route(existingUser) : route;
      return redirect(redirectPath);
    }
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return {
      error: "Something went wrong. Please try again.",
    };
  }
}

// const forgotPasswordSchema = z.object({
//   email: z.string().email("Please enter a valid email address"),
// });

// const resetPasswordSchema = z.object({
//   token: z.string(),
//   newPassword: z.string().min(8, "Password must be at least 8 characters"),
// });

// export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
// export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

// export async function initiatePasswordReset(
//   values: ForgotPasswordValues
// ): Promise<{ success?: boolean; error?: string }> {
//   try {
//     // Check environment variables at the start
//     const requiredEnvVars = {
//       SMTP_HOST: process.env.SMTP_HOST,
//       SMTP_PORT: process.env.SMTP_PORT,
//       SMTP_USER: process.env.SMTP_USER,
//       SMTP_PASSWORD: process.env.SMTP_PASSWORD,
//       SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL,
//       NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
//     };

//     console.log("Environment variables state:", {
//       ...requiredEnvVars,
//       SMTP_PASSWORD: requiredEnvVars.SMTP_PASSWORD ? "[SET]" : "[NOT SET]",
//     });

//     // Validate all required environment variables
//     const missingVars = Object.entries(requiredEnvVars)
//       .filter(([key, value]) => !value)
//       .map(([key]) => key);

//     if (missingVars.length > 0) {
//       throw new Error(
//         `Missing required environment variables: ${missingVars.join(", ")}`
//       );
//     }

//     const { email } = forgotPasswordSchema.parse(values);
//     console.log("Attempting password reset for:", email);

//     const user = await prisma.user.findFirst({
//       where: {
//         email: {
//           equals: email,
//           mode: "insensitive",
//         },
//       },
//     });

//     if (!user) {
//       console.log("No user found with email:", email);
//       return { success: true };
//     }

//     const resetToken = randomBytes(32).toString("hex");
//     const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

//     try {
//       // Get base URL with fallback
//       const baseUrl =
//         process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || // Remove trailing slash if present
//         (process.env.NODE_ENV === "development"
//           ? "http://localhost:3000"
//           : undefined);

//       if (!baseUrl) {
//         throw new Error("Application URL is not configured");
//       }

//       console.log("Using base URL:", baseUrl);
//       const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;
//       console.log("Generated reset link:", resetLink);

//       // Save the token first
//       await prisma.user.update({
//         where: { id: user.id },
//         data: {
//           resetToken,
//           resetTokenExpiry,
//         },
//       });
//       console.log("Reset token saved to database");

//       // Send email
//       await sendEmail({
//         to: user.email,
//         subject: "Reset Your Password",
//         html: `
//           <!DOCTYPE html>
//           <html>
//             <head>
//               <style>
//                 body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
//                 .button { 
//                   background-color: #0070f3;
//                   color: white;
//                   padding: 12px 24px;
//                   text-decoration: none;
//                   border-radius: 5px;
//                   display: inline-block;
//                   margin: 20px 0;
//                 }
//                 .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//               </style>
//             </head>
//             <body>
//               <div class="container">
//                 <h1>Reset Your Password</h1>
//                 <p>We received a request to reset your password. Click the button below to proceed:</p>
//                 <a href="${resetLink}" class="button">Reset Password</a>
//                 <p>Or copy this link to your browser:</p>
//                 <p>${resetLink}</p>
//                 <p>This link will expire in 1 hour.</p>
//                 <p>If you didn't request this, please ignore this email.</p>
//               </div>
//             </body>
//           </html>
//         `,
//       });

//       return { success: true };
//     } catch (emailError) {
//       console.error("Detailed email error:", {
//         error: emailError,
//         stack: emailError instanceof Error ? emailError.stack : undefined,
//         message:
//           emailError instanceof Error ? emailError.message : "Unknown error",
//       });

//       // Clean up token if email fails
//       await prisma.user.update({
//         where: { id: user.id },
//         data: {
//           resetToken: null,
//           resetTokenExpiry: null,
//         },
//       });

//       throw emailError;
//     }
//   } catch (error) {
//     console.error("Password reset error:", {
//       error,
//       message: error instanceof Error ? error.message : "Unknown error",
//       stack: error instanceof Error ? error.stack : undefined,
//     });

//     return {
//       error:
//         error instanceof Error
//           ? error.message
//           : "Failed to process password reset request",
//     };
//   }
// }

export async function validateResetToken(
  token: string
): Promise<{ valid: boolean; error?: string }> {
  try {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    return { valid: !!user };
  } catch (error) {
    console.error("Token validation error:", error);
    return { valid: false, error: "Invalid or expired reset token" };
  }
}

export async function resetPassword({
  token,
  newPassword,
}: {
  token: string;
  newPassword: string;
}): Promise<{ success?: boolean; error?: string; redirectTo?: string }> {
  if (!token) {
    return { error: "Reset token is required" };
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return { error: "Invalid or expired reset token" };
    }

    const passwordHash = await hash(newPassword, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
    const redirectPath = "/login";

    return {
      success: true,
      redirectTo: redirectPath,
    };
  } catch (error) {
    if (!isRedirectError(error)) {
      console.error("Password reset error:", error);
    }
    return { error: "Failed to reset password" };
  }
}
