import { z } from "zod";

const requiredString = z.string().trim().min(1, "Required");
<<<<<<< HEAD
const requiredInt = z.number().int().min(1, "Must be greater than 0");
=======
const requiredInt = z.number().int().positive("Must be greater than 0");
>>>>>>> 4a72aa36f2cb0937f820d920c3f39c41bf93f506

export const signUpSchema = z.object({
    email: requiredString.email("Invalid email address"),
    username: requiredString.regex(
        /^[a-zA-Z0-9_-]+$/,
        "Only letters, numbers, - and _ allowed"
    ),
    password: requiredString.min(8, "Must be at least 8 characters"),
<<<<<<< HEAD
    phoneNumber: requiredInt,
=======
    phoneNumber: requiredInt.min(10, "Must be at least 10 characters"),
>>>>>>> 4a72aa36f2cb0937f820d920c3f39c41bf93f506
});

export type signUpValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
    email: requiredString,
    password: requiredString,
});

export type loginValues = z.infer<typeof loginSchema>;