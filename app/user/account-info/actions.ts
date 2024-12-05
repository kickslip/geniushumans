"use server";

import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma, User } from "@prisma/client";

type UserProfileSelect = {
  id: true;
  username: true;
  createdAt: true;
  updatedAt: true;
};

export async function signOut() {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value;
    if (!sessionId) {
        return {
            error: "No active session"
        };
    }

    try {
        await lucia.invalidateSession(sessionId);
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    } catch (error) {
        return {
            error: "Failed to sign out"
        };
    }

    revalidatePath("/");
    redirect("/");
}

export async function updateProfile(
    userId: string,
    data: Partial<Pick<User, 'username'>>
) {
    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                ...data,
                updatedAt: new Date()
            },
            select: {
                id: true,
                username: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        revalidatePath("/profile");
        return { success: true, user: updatedUser };
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return { error: "Username already taken" };
            }
        }
        return { error: "Failed to update profile" };
    }
}

export async function deleteAccount(userId: string) {
    try {
        // First, invalidate all sessions for this user
        const userSessions = await prisma.session.findMany({
            where: { userId }
        });

        for (const session of userSessions) {
            await lucia.invalidateSession(session.id);
        }

        // Delete the user
        await prisma.user.delete({
            where: { id: userId }
        });

        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

        revalidatePath("/");
        redirect("/");
    } catch (error) {
        return {
            error: "Failed to delete account"
        };
    }
}

export async function getUserProfile(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        if (!user) {
            return { error: "User not found" };
        }

        return { success: true, user };
    } catch (error) {
        return {
            error: "Failed to fetch user profile"
        };
    }
}