import { z } from "zod";

const emptyToUndefined = (val: unknown) =>
  typeof val === "string" && val.trim() === "" ? undefined : val;

const optionalInt = (min: number, max: number) =>
  z.preprocess(emptyToUndefined, z.coerce.number().int().min(min).max(max).optional());

const optionalString = (max: number) =>
  z.preprocess(emptyToUndefined, z.string().trim().max(max).optional());

const optionalUrl = () =>
  z.preprocess(emptyToUndefined, z.string().trim().url("Enter a valid URL").optional());

export const playerFormSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(60),
  lastName: z.string().trim().min(1, "Last name is required").max(60),
  dob: z.string().refine((val) => !Number.isNaN(Date.parse(val)), "Enter a valid date"),
  gender: z.enum(["MALE", "FEMALE"], { message: "Select a gender" }),
  playerType: z.enum(["HIGH_SCHOOL", "JUCO", "TRANSFER"], { message: "Select a player type" }),
  gradYear: z.coerce.number().int().min(2024).max(2035),
  country: z.string().trim().min(2, "Country is required").max(2),
  state: optionalString(2),
  city: optionalString(80),
  heightIn: optionalInt(30, 96),
  weightLb: optionalInt(40, 400),
  gpa: z.preprocess(emptyToUndefined, z.coerce.number().min(0).max(5).optional()),
  bio: optionalString(2000),
  primaryPhotoUrl: optionalUrl(),
  photoConsent: z.coerce.boolean().optional(),
  sportId: z.string().min(1, "Select a sport"),
  position: optionalString(60),
  videoUrl: optionalUrl(),
});

export type PlayerFormValues = z.infer<typeof playerFormSchema>;
