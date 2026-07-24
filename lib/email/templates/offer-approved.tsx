import { Text } from "@react-email/components";
import { EmailLayout, EmailButton, emailTextStyle } from "./layout";
import { APP_URL } from "@/lib/email/resend";

export function OfferApprovedEmail({
  playerName,
  schoolName,
}: {
  playerName: string;
  schoolName: string;
}) {
  return (
    <EmailLayout
      preview={`${schoolName}'s offer for ${playerName} is now live`}
      heading="Offer approved"
    >
      <Text style={emailTextStyle}>
        Good news &mdash; the offer from <strong>{schoolName}</strong> for{" "}
        <strong>{playerName}</strong> has been approved and now shows on the profile.
      </Text>
      <EmailButton href={`${APP_URL}/dashboard`}>Go to My Athletes</EmailButton>
    </EmailLayout>
  );
}
