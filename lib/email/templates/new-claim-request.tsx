import { Text } from "@react-email/components";
import { EmailLayout, EmailButton, emailTextStyle } from "./layout";
import { APP_URL } from "@/lib/email/resend";

export function NewClaimRequestEmail({
  playerName,
  requesterName,
  requesterEmail,
}: {
  playerName: string;
  requesterName: string;
  requesterEmail: string;
}) {
  return (
    <EmailLayout
      preview={`${requesterName} wants to claim ${playerName}'s profile`}
      heading="New claim request"
    >
      <Text style={emailTextStyle}>
        <strong>{requesterName}</strong> ({requesterEmail}) has requested to claim{" "}
        <strong>{playerName}</strong>&apos;s profile.
      </Text>
      <EmailButton href={`${APP_URL}/admin/claims`}>Review Claim</EmailButton>
    </EmailLayout>
  );
}
