import { z } from "zod";

export const sportStatSuggestionsFormSchema = z.object({
  suggestions: z.array(z.string().trim().min(1).max(60)).max(20),
});

export type SportStatSuggestionsFormValues = z.infer<typeof sportStatSuggestionsFormSchema>;
