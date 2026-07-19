import { z } from "zod";

const emptyToUndefined = (val: unknown) =>
  typeof val === "string" && val.trim() === "" ? undefined : val;

export const searchParamsSchema = z.object({
  country: z.preprocess(emptyToUndefined, z.string().trim().max(2).optional()),
  state: z.preprocess(emptyToUndefined, z.string().trim().max(2).optional()),
  sportId: z.preprocess(emptyToUndefined, z.string().optional()),
  position: z.preprocess(emptyToUndefined, z.string().trim().max(60).optional()),
  gender: z.preprocess(emptyToUndefined, z.enum(["MALE", "FEMALE"]).optional()),
  playerType: z.preprocess(
    emptyToUndefined,
    z.enum(["HIGH_SCHOOL", "JUCO", "TRANSFER"]).optional()
  ),
  gradYear: z.preprocess(emptyToUndefined, z.coerce.number().int().optional()),
  page: z.preprocess(emptyToUndefined, z.coerce.number().int().min(1).optional()),
});

export type SearchParamsValues = z.infer<typeof searchParamsSchema>;
