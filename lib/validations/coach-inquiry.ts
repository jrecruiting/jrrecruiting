import { z } from "zod";

export const coachInquirySchema = z.object({
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000),
});

export type CoachInquiryValues = z.infer<typeof coachInquirySchema>;
