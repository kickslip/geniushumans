"use server"

import prisma from "@/lib/prisma";
import { loginSchema, loginValues } from "@/lib/validation";
import { isRedirectError } from "next/dist/client/components/redirect";
import { verify } from "@node-rs/argon2";
import { lucia } from "@/auth";
import { generateId } from "lucia";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(
    credentials: loginValues,
): Promise<{error: string}> {
    try {
        const {email, password} = loginSchema.parse(credentials)

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

        const validPassword = await verify(existingUser.passwordHash, password, {
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1,
        })

        if (!validPassword) {
            return {
                error: "Incorrect email or password"
            }
        }

        // Generate session token and create session
        const sessionToken = generateId(40);
        const session = await prisma.session.create({
            data: {
                id: generateId(40),
                userId: existingUser.id,
                expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                sessionToken: sessionToken
            }
        });

        // Create Lucia session and set cookie
        const luciaSession = await lucia.createSession(existingUser.id, {})
        const sessionCookie = lucia.createSessionCookie(luciaSession.id);
        cookies().set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes
        );

        return redirect("/")
    } catch (error) {
        if (isRedirectError(error)) throw error;
        console.error(error);
        return {
            error: "Something went wrong. Please try again.",
        };
    }
}