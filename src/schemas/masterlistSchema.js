import { z } from "zod";

export const masterlistSchema = z
    .object({
        id_number: z.string().min(1, "User ID is required"),
        first_name: z.string().min(1, "First name is required"),
        last_name: z.string().min(1, "Last name is required"),
        role: z.enum(["student", "faculty", "staff"], {
            errorMap: () => ({ message: "Please select a valid role" }),
        }),
        student_program: z.string().nullable().optional(),
        student_year: z.string().nullable().optional(),
    })
    .superRefine((data, ctx) => {
        if (data.role === "student") {
            if (!data.student_program) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["student_program"],
                    message: "Student program is required",
                });
            }
            if (!data.student_year) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["student_year"],
                    message: "Student year is required",
                });
            }
        }
    });