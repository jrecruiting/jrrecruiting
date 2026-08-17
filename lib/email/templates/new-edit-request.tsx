import { Text } from "@react-email/components";
import { EmailLayout, EmailButton, emailTextStyle } from "./layout";
import { APP_URL } from "@/lib/email/resend";

export function NewEditRequestEmail({
  playerName,
  submitterName,
  submitterEmail,
}: {
  playerName: string;
  submitterName: string;
  submitterEmail: string;
}) {
  return (
    <EmailLayout
      preview={`${submitterName} submitted a profile update for ${playerName}`}
      heading="New profile edit request"
    >
      <Text style={emailTextStyle}>
        <strong>{submitterName}</strong> ({submitterEmail}) has submitted a profile update for{" "}
        <strong>{playerName}</strong>, including any new photos or highlight videos. It's waiting
        for your review.
      </Text>
      <EmailButton href={`${APP_URL}/admin/edit-requests`}>Review Request</EmailButton>
    </EmailLayout>
  );
}
