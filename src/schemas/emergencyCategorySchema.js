import { z } from "zod";

export const emergencyCategorySchema = z.object({
    name: z
        .string()
        .min(1, "Category name is required")
        .max(255, "Category name must be 255 characters or fewer"),
    description: z.string().optional(),
});