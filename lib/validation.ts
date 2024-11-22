import { z } from "zod";

const requiredString = z.string().trim().min(1, "Required");
const requiredInt = z.number().int().positive("Must be greater than 0");

export const signUpSchema = z.object({
    email: requiredString.email("Invalid email address"),
    username: requiredString.regex(
        /^[a-zA-Z0-9_-]+$/,
        "Only letters, numbers, - and _ allowed"
    ),
    password: requiredString.min(8, "Must be at least 8 characters"),
    phoneNumber: requiredInt.min(10, "Must be at least 10 characters"),
});

export type signUpValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
    email: requiredString,
    password: requiredString,
});

export type loginValues = z.infer<typeof loginSchema>;

export const createPostSchema = z.object({
    content: requiredString,
});