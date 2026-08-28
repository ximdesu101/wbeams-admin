import { z } from "zod";

export const operatorSchema = z.object({
    operator_id: z
        .string()
        .trim()
        .min(1, "Operator ID is required.")
        .max(20, "Operator ID must not exceed 20 characters."),

    first_name: z
        .string()
        .trim()
        .min(2, "First name must be at least 2 characters.")
        .max(50, "First name must not exceed 50 characters.")
        .regex(
            /^[A-Za-zÀ-ÿ\s'-]+$/,
            "First name may only contain letters, spaces, apostrophes, and hyphens.",
        ),

    last_name: z
        .string()
        .trim()
        .min(2, "Last name must be at least 2 characters.")
        .max(50, "Last name must not exceed 50 characters.")
        .regex(
            /^[A-Za-zÀ-ÿ\s'-]+$/,
            "Last name may only contain letters, spaces, apostrophes, and hyphens.",
        ),

    contact_number: z
        .string()
        .trim()
        .regex(
            /^(09\d{9}|\+639\d{9})$/,
            "Contact number must be a valid Php mobile number",
        ),

    email: z
        .string()
        .trim()
        .min(1, "Email is Required")
        .email("Enter a valid email address")
        .max(255, "Email address must not exceed 255 characters")
        .transform((email) => email.toLowerCase()),
});
