import type { ReactElement } from "react";
import { PlayerUpdatedEmail } from "./player-updated";
import { CoachApprovedEmail } from "./coach-approved";
import { CoachRejectedEmail } from "./coach-rejected";
import { ClaimApprovedEmail } from "./claim-approved";
import { ClaimRejectedEmail } from "./claim-rejected";
import { ListingPaidEmail } from "./listing-paid";
import { ContactInquiryEmail } from "./contact-inquiry";
import { PasswordResetEmail } from "./password-reset";

export type EmailTemplateKey =
  | "player-updated"
  | "coach-approved"
  | "coach-rejected"
  | "claim-approved"
  | "claim-rejected"
  | "listing-paid"
  | "contact-inquiry"
  | "password-reset";

export function renderEmailTemplate(
  templateKey: string,
  payload: Record<string, unknown>
): { subject: string; react: ReactElement } | null {
  switch (templateKey as EmailTemplateKey) {
    case "player-updated":
      return {
        subject: `${payload.playerName as string}'s profile was updated`,
        react: (
          <PlayerUpdatedEmail
            playerId={payload.playerId as string}
            playerName={payload.playerName as string}
            coachName={(payload.coachName as string) || "Coach"}
          />
        ),
      };
    case "coach-approved":
      return {
        subject: "You're approved to search J.R. Recruiting",
        react: <CoachApprovedEmail coachName={(payload.coachName as string) || "Coach"} />,
      };
    case "coach-rejected":
      return {
        subject: "Update on your J.R. Recruiting coach application",
        react: (
          <CoachRejectedEmail
            coachName={(payload.coachName as string) || "Coach"}
            reason={payload.reason as string | undefined}
          />
        ),
      };
    case "claim-approved":
      return {
        subject: "Your claim request was approved",
        react: <ClaimApprovedEmail playerName={payload.playerName as string} />,
      };
    case "claim-rejected":
      return {
        subject: "Update on your claim request",
        react: <ClaimRejectedEmail playerName={payload.playerName as string} />,
      };
    case "listing-paid":
      return {
        subject: `${payload.playerName as string}'s profile is live!`,
        react: <ListingPaidEmail playerName={payload.playerName as string} />,
      };
    case "contact-inquiry":
      return {
        subject: `New contact form message from ${payload.name as string}`,
        react: (
          <ContactInquiryEmail
            name={payload.name as string}
            email={payload.email as string}
            message={payload.message as string}
          />
        ),
      };
    case "password-reset":
      return {
        subject: "Reset your J.R. Recruiting password",
        react: <PasswordResetEmail resetUrl={payload.resetUrl as string} />,
      };
    default:
      return null;
  }
}
