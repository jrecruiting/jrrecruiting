import { Text } from "@react-email/components";
import { EmailLayout, EmailButton, emailTextStyle } from "./layout";
import { APP_URL } from "@/lib/email/resend";

export function EditApprovedEmail({ playerName }: { playerName: string }) {
  return (
    <EmailLayout
      preview={`Your changes to ${playerName}'s profile were approved`}
      heading="Your profile update was approved"
    >
      <Text style={emailTextStyle}>
        The changes you submitted for <strong>{playerName}</strong>&apos;s profile have
        been reviewed and are now live.
      </Text>
      <EmailButton href={`${APP_URL}/dashboard`}>Go to My Athletes</EmailButton>
    </EmailLayout>
  );
}
