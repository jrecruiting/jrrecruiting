import { Text } from "@react-email/components";
import { EmailLayout, EmailButton, emailTextStyle } from "./layout";
import { APP_URL } from "@/lib/email/resend";

export function OfferRejectedEmail({
  playerName,
  schoolName,
}: {
  playerName: string;
  schoolName: string;
}) {
  return (
    <EmailLayout
      preview={`Update on the ${schoolName} offer for ${playerName}`}
      heading="Update on your submitted offer"
    >
      <Text style={emailTextStyle}>
        We weren&apos;t able to approve the offer from <strong>{schoolName}</strong> for{" "}
        <strong>{playerName}</strong>. If you think this was a mistake, please contact our team.
      </Text>
      <EmailButton href={`${APP_URL}/contact`}>Contact Us</EmailButton>
    </EmailLayout>
  );
}
