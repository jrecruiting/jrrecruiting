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
  gender: z.enum(["MALE", "FEMALE"], { message: "Select a gender" }),
  playerType: z.enum(["HIGH_SCHOOL", "JUCO", "TRANSFER"], { message: "Select a player type" }),
  gradYear: z.coerce.number().int().min(2024).max(2035),
  country: z.string().trim().min(2, "Country is required").max(2),
  state: optionalString(2),
  schoolName: optionalString(150),
  heightFeet: optionalInt(3, 8),
  heightInches: optionalInt(0, 11),
  weightLb: optionalInt(40, 400),
  gpa: z.preprocess(emptyToUndefined, z.coerce.number().min(0).max(5).optional()),
  bio: optionalString(2000),
  // Blob pathname (e.g. "player-photos/xyz.png"), not a full URL -- photos
  // are private and only ever resolved through /api/blob/photo.
  primaryPhotoUrl: optionalString(300),
  photoConsent: z.coerce.boolean().optional(),
  sportId: z.string().min(1, "Select a sport"),
  position: optionalString(60),
  videoUrl: optionalUrl(),
  instagramHandle: optionalString(30),
  xHandle: optionalString(15),
  cellPhone: optionalString(20),
});

export type PlayerFormValues = z.infer<typeof playerFormSchema>;
