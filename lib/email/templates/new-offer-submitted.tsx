import { Text } from "@react-email/components";
import { EmailLayout, EmailButton, emailTextStyle } from "./layout";
import { APP_URL } from "@/lib/email/resend";

export function NewOfferSubmittedEmail({
  playerName,
  schoolName,
  submitterName,
  submitterEmail,
}: {
  playerName: string;
  schoolName: string;
  submitterName: string;
  submitterEmail: string;
}) {
  return (
    <EmailLayout
      preview={`${submitterName} submitted an offer from ${schoolName} for ${playerName}`}
      heading="New offer submitted"
    >
      <Text style={emailTextStyle}>
        <strong>{submitterName}</strong> ({submitterEmail}) added an offer from{" "}
        <strong>{schoolName}</strong> for <strong>{playerName}</strong>. It won&apos;t show on
        the profile until you review it.
      </Text>
      <EmailButton href={`${APP_URL}/admin/offers`}>Review Offer</EmailButton>
    </EmailLayout>
  );
}
