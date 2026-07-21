import { Text } from "@react-email/components";
import { EmailLayout, EmailButton, emailTextStyle } from "./layout";
import { APP_URL } from "@/lib/email/resend";

export function EditRejectedEmail({ playerName }: { playerName: string }) {
  return (
    <EmailLayout
      preview={`Update on your changes to ${playerName}'s profile`}
      heading="Your profile update wasn't approved"
    >
      <Text style={emailTextStyle}>
        The changes you submitted for <strong>{playerName}</strong>&apos;s profile
        weren&apos;t approved, so the profile stays as it was. If you think this was a
        mistake or have questions, please contact our team.
      </Text>
      <EmailButton href={`${APP_URL}/contact`}>Contact Us</EmailButton>
    </EmailLayout>
  );
}
