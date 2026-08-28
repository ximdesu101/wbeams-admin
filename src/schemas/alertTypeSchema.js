import { z } from "zod";

export const alertTypeSchema = z.object({
    emergency_category_id: z.string().min(1, "Parent category is required"),
    name: z
        .string()
        .min(1, "Alert type name is required")
        .max(255, "Alert type name must be 255 characters or fewer"),
    description: z.string().optional(),
    response_instructions: z.array(z.string()).optional(),
    severity: z.enum(["low", "medium", "high", "critical"], {
        errorMap: () => ({ message: "Select a valid severity level" }),
    }),
    icon: z.string().min(1, "Select an icon"),
    color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Color must be a valid hex code"),
});