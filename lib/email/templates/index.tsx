import type { ReactElement } from "react";
import { PlayerUpdatedEmail } from "./player-updated";
import { CoachApprovedEmail } from "./coach-approved";
import { CoachRejectedEmail } from "./coach-rejected";
import { ClaimApprovedEmail } from "./claim-approved";
import { ClaimRejectedEmail } from "./claim-rejected";
import { EditApprovedEmail } from "./edit-approved";
import { EditRejectedEmail } from "./edit-rejected";
import { ListingPaidEmail } from "./listing-paid";
import { ContactInquiryEmail } from "./contact-inquiry";
import { PasswordResetEmail } from "./password-reset";
import { NewClaimRequestEmail } from "./new-claim-request";
import { NewEditRequestEmail } from "./new-edit-request";
import { NewCoachSignupEmail } from "./new-coach-signup";
import { NewOfferSubmittedEmail } from "./new-offer-submitted";
import { OfferApprovedEmail } from "./offer-approved";
import { OfferRejectedEmail } from "./offer-rejected";
import { NewSchoolInterestSubmittedEmail } from "./new-school-interest-submitted";
import { SchoolInterestApprovedEmail } from "./school-interest-approved";
import { SchoolInterestRejectedEmail } from "./school-interest-rejected";
import { TeamCoachInviteEmail } from "./team-coach-invite";
import { TeamCoachProfileViewedEmail } from "./team-coach-profile-viewed";
import { TeamCoachProfileUpdatedEmail } from "./team-coach-profile-updated";
import { StarCreatedEmail } from "./star-created";
import { AdminActivityDigestEmail } from "./admin-activity-digest";

export type EmailTemplateKey =
  | "player-updated"
  | "coach-approved"
  | "coach-rejected"
  | "claim-approved"
  | "claim-rejected"
  | "edit-approved"
  | "edit-rejected"
  | "listing-paid"
  | "contact-inquiry"
  | "password-reset"
  | "new-claim-request"
  | "new-edit-request"
  | "new-coach-signup"
  | "new-offer-submitted"
  | "offer-approved"
  | "offer-rejected"
  | "new-school-interest-submitted"
  | "school-interest-approved"
  | "school-interest-rejected"
  | "team-coach-invite"
  | "team-coach-profile-viewed"
  | "team-coach-profile-updated"
  | "star-created"
  | "admin-activity-digest";

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
    case "edit-approved":
      return {
        subject: `${payload.playerName as string}'s profile update was approved`,
        react: <EditApprovedEmail playerName={payload.playerName as string} />,
      };
    case "edit-rejected":
      return {
        subject: `Update on your ${payload.playerName as string} profile edit`,
        react: <EditRejectedEmail playerName={payload.playerName as string} />,
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
    case "new-claim-request":
      return {
        subject: `New claim request for ${payload.playerName as string}`,
        react: (
          <NewClaimRequestEmail
            playerName={payload.playerName as string}
            requesterName={payload.requesterName as string}
            requesterEmail={payload.requesterEmail as string}
          />
        ),
      };
    case "new-edit-request":
      return {
        subject: `New profile edit request for ${payload.playerName as string}`,
        react: (
          <NewEditRequestEmail
            playerName={payload.playerName as string}
            submitterName={payload.submitterName as string}
            submitterEmail={payload.submitterEmail as string}
          />
        ),
      };
    case "new-coach-signup":
      return {
        subject: `New coach account pending approval: ${payload.coachName as string}`,
        react: (
          <NewCoachSignupEmail
            coachName={payload.coachName as string}
            coachEmail={payload.coachEmail as string}
            organization={payload.organization as string}
          />
        ),
      };
    case "new-offer-submitted":
      return {
        subject: `New offer submitted for ${payload.playerName as string}`,
        react: (
          <NewOfferSubmittedEmail
            playerName={payload.playerName as string}
            schoolName={payload.schoolName as string}
            submitterName={payload.submitterName as string}
            submitterEmail={payload.submitterEmail as string}
          />
        ),
      };
    case "offer-approved":
      return {
        subject: `${payload.schoolName as string}'s offer for ${payload.playerName as string} was approved`,
        react: (
          <OfferApprovedEmail
            playerName={payload.playerName as string}
            schoolName={payload.schoolName as string}
          />
        ),
      };
    case "offer-rejected":
      return {
        subject: `Update on the ${payload.schoolName as string} offer for ${payload.playerName as string}`,
        react: (
          <OfferRejectedEmail
            playerName={payload.playerName as string}
            schoolName={payload.schoolName as string}
          />
        ),
      };
    case "new-school-interest-submitted":
      return {
        subject: `New school in contact submitted for ${payload.playerName as string}`,
        react: (
          <NewSchoolInterestSubmittedEmail
            playerName={payload.playerName as string}
            schoolName={payload.schoolName as string}
            submitterName={payload.submitterName as string}
            submitterEmail={payload.submitterEmail as string}
          />
        ),
      };
    case "school-interest-approved":
      return {
        subject: `${payload.schoolName as string} approved for ${payload.playerName as string}`,
        react: (
          <SchoolInterestApprovedEmail
            playerName={payload.playerName as string}
            schoolName={payload.schoolName as string}
          />
        ),
      };
    case "school-interest-rejected":
      return {
        subject: `Update on ${payload.schoolName as string} for ${payload.playerName as string}`,
        react: (
          <SchoolInterestRejectedEmail
            playerName={payload.playerName as string}
            schoolName={payload.schoolName as string}
          />
        ),
      };
    case "team-coach-invite":
      return {
        subject: `You've been given access to ${payload.playerName as string}'s recruiting profile`,
        react: (
          <TeamCoachInviteEmail
            coachName={payload.coachName as string}
            playerName={payload.playerName as string}
            setupUrl={payload.setupUrl as string}
          />
        ),
      };
    case "team-coach-profile-viewed":
      return {
        subject: `A college coach viewed ${payload.playerName as string}'s profile`,
        react: (
          <TeamCoachProfileViewedEmail
            playerId={payload.playerId as string}
            playerName={payload.playerName as string}
          />
        ),
      };
    case "team-coach-profile-updated":
      return {
        subject: `${payload.playerName as string}'s profile was updated`,
        react: (
          <TeamCoachProfileUpdatedEmail
            playerId={payload.playerId as string}
            playerName={payload.playerName as string}
          />
        ),
      };
    case "star-created":
      return {
        subject: `${payload.coachName as string} starred ${payload.playerName as string}`,
        react: (
          <StarCreatedEmail
            playerId={payload.playerId as string}
            playerName={payload.playerName as string}
            coachName={payload.coachName as string}
            organization={(payload.organization as string) || ""}
          />
        ),
      };
    case "admin-activity-digest":
      return {
        subject: `Coach activity: ${payload.periodLabel as string}`,
        react: (
          <AdminActivityDigestEmail
            periodLabel={payload.periodLabel as string}
            newCoaches={payload.newCoaches as { name: string; email: string; organization: string }[]}
            views={payload.views as { playerName: string; coachName: string }[]}
            stars={payload.stars as { playerName: string; coachName: string }[]}
          />
        ),
      };
    default:
      return null;
  }
}
