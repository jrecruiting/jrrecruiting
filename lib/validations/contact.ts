import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000),
  company: z.string().max(0, "Spam detected").optional().or(z.literal("")),
});

export type ContactValues = z.infer<typeof contactSchema>;
