import { Text } from "@react-email/components";
import { EmailLayout, EmailButton, emailTextStyle } from "./layout";
import { APP_URL } from "@/lib/email/resend";

export function ClaimApprovedEmail({ playerName }: { playerName: string }) {
  return (
    <EmailLayout
      preview={`Your claim for ${playerName} was approved`}
      heading="Your claim request was approved"
    >
      <Text style={emailTextStyle}>
        Good news &mdash; your request to link <strong>{playerName}</strong>&apos;s
        profile to your account has been approved. You can now manage this
        profile from your dashboard.
      </Text>
      <EmailButton href={`${APP_URL}/dashboard`}>Go to My Athletes</EmailButton>
    </EmailLayout>
  );
}
