import { z } from "zod";

export const signUpSchema = z
  .object({
    role: z.enum(["PARENT", "COACH"]),
    name: z.string().trim().min(1, "Name is required").max(120),
    email: z.string().trim().toLowerCase().email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters").max(72),
    organization: z.string().trim().max(120).optional().or(z.literal("")),
    title: z.string().trim().max(80).optional().or(z.literal("")),
    phone: z.string().trim().max(30).optional().or(z.literal("")),
  })
  .refine(
    (data) => data.role !== "COACH" || (data.organization && data.organization.length > 0),
    { message: "Organization is required for coach accounts", path: ["organization"] }
  );

export type SignUpValues = z.infer<typeof signUpSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: z.string().min(8, "Password must be at least 8 characters").max(72),
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
