"use server";

import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import { signUpSchema, signUpValues } from "@/lib/validation";
import { hash } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signUp(
  formData: signUpValues
): Promise<{ error?: string } | never> {
  try {
    const validatedData = signUpSchema.parse(formData);

    const userId = generateIdFromEntropySize(10);

    const passwordHash = await hash(validatedData.password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    const existingUsername = await prisma.user.findFirst({
      where: {
        username: {
          equals: validatedData.username,
          mode: "insensitive",
        },
      },
    });

    if (existingUsername) {
      return {
        error: "Username already taken",
      };
    }

    const existingEmail = await prisma.user.findFirst({
      where: {
        email: {
          equals: validatedData.email,
          mode: "insensitive",
        },
      },
    });

    if (existingEmail) {
      return {
        error: "Email already taken",
      };
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          id: userId,
          username: validatedData.username,
          email: validatedData.email,
          passwordHash,
          phoneNumber: validatedData.phoneNumber,
        },
      });
    });

    redirect("/");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return {
      error: "Something went wrong. Please try again.",
    };
  }
}