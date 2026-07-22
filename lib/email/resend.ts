import { Resend } from "resend";

export const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const EMAIL_FROM = process.env.EMAIL_FROM || "J.R. Recruiting <onboarding@resend.dev>";

export const APP_URL = process.env.AUTH_URL || "http://localhost:3000";

export const ADMIN_EMAIL = "j.r.recruiting13@gmail.com";
