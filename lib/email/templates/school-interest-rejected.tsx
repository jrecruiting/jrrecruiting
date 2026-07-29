import { Text } from "@react-email/components";
import { EmailLayout, EmailButton, emailTextStyle } from "./layout";
import { APP_URL } from "@/lib/email/resend";

export function SchoolInterestRejectedEmail({
  playerName,
  schoolName,
}: {
  playerName: string;
  schoolName: string;
}) {
  return (
    <EmailLayout
      preview={`Update on ${schoolName} for ${playerName}`}
      heading="Update on your submission"
    >
      <Text style={emailTextStyle}>
        We weren&apos;t able to approve <strong>{schoolName}</strong> as a school currently in
        contact with <strong>{playerName}</strong>. If you think this was a mistake, please
        contact our team.
      </Text>
      <EmailButton href={`${APP_URL}/contact`}>Contact Us</EmailButton>
    </EmailLayout>
  );
}
