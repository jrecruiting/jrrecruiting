import type { ReactElement } from "react";
import { PlayerUpdatedEmail } from "./player-updated";
import { CoachApprovedEmail } from "./coach-approved";
import { CoachRejectedEmail } from "./coach-rejected";
import { ClaimApprovedEmail } from "./claim-approved";
import { ClaimRejectedEmail } from "./claim-rejected";
import { ListingPaidEmail } from "./listing-paid";

export type EmailTemplateKey =
  | "player-updated"
  | "coach-approved"
  | "coach-rejected"
  | "claim-approved"
  | "claim-rejected"
  | "listing-paid";

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
    default:
      return null;
  }
}
