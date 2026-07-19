import { Text } from "@react-email/components";
import { EmailLayout, EmailButton, emailTextStyle } from "./layout";
import { APP_URL } from "@/lib/email/resend";

export function ClaimRejectedEmail({ playerName }: { playerName: string }) {
  return (
    <EmailLayout
      preview={`Update on your claim for ${playerName}`}
      heading="Update on your claim request"
    >
      <Text style={emailTextStyle}>
        We weren&apos;t able to approve your request to link{" "}
        <strong>{playerName}</strong>&apos;s profile to your account. If you
        think this was a mistake, please contact our team.
      </Text>
      <EmailButton href={`${APP_URL}/contact`}>Contact Us</EmailButton>
    </EmailLayout>
  );
}
