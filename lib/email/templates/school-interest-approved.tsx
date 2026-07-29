import { Text } from "@react-email/components";
import { EmailLayout, EmailButton, emailTextStyle } from "./layout";
import { APP_URL } from "@/lib/email/resend";

export function SchoolInterestApprovedEmail({
  playerName,
  schoolName,
}: {
  playerName: string;
  schoolName: string;
}) {
  return (
    <EmailLayout
      preview={`${schoolName} is now shown as in contact with ${playerName}`}
      heading="School in contact approved"
    >
      <Text style={emailTextStyle}>
        Good news &mdash; <strong>{schoolName}</strong> has been approved and now shows as
        currently in contact with <strong>{playerName}</strong> on the profile.
      </Text>
      <EmailButton href={`${APP_URL}/dashboard`}>Go to My Athletes</EmailButton>
    </EmailLayout>
  );
}
