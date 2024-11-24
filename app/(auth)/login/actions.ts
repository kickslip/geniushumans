"use server"

import prisma from "@/lib/prisma";
import { isRedirectError } from "next/dist/client/components/redirect";
import { verify } from "@node-rs/argon2";
import { lucia } from "@/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loginSchema,LoginValues } from "@/lib/validations";

export async function login(
    credintails: LoginValues,
): Promise<{error: string}> {
    try {
        const {email, password} = loginSchema.parse(credintails)

        const existingUser = await prisma.user.findFirst({
            where: {
                email: {
                    equals: email,
                    mode: "insensitive"
                }
            }
        })

        if (!existingUser || !existingUser.passwordHash) {
            return {
                error: "Incorrect email or password"
            }
        }

        const validpassword = await verify(existingUser.passwordHash, password, {
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1,
        })

        if (!validpassword) {
            return {
                error: "Incorrect email or password"
            }
        }

        // Modified session creation to use correct argument format
        const session = await lucia.createSession(
            existingUser.id,
            {} // attributes - can be empty if no additional data needed
        );
        
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies().set(
           sessionCookie.name,
           sessionCookie.value,
           sessionCookie.attributes
        );

        return redirect("/")
    } catch (error) {
        if (isRedirectError(error)) throw error;
        console.error(error);
        return{
            error: "Something went wrong. Please try again.",
        };
    }
}