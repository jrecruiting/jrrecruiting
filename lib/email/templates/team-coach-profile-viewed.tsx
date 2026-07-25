import { Text } from "@react-email/components";
import { EmailLayout, EmailButton, emailTextStyle } from "./layout";
import { APP_URL } from "@/lib/email/resend";

export function TeamCoachProfileViewedEmail({
  playerId,
  playerName,
}: {
  playerId: string;
  playerName: string;
}) {
  return (
    <EmailLayout
      preview={`A college coach viewed ${playerName}'s profile`}
      heading="A college coach viewed the profile"
    >
      <Text style={emailTextStyle}>
        A college coach just viewed <strong>{playerName}</strong>&apos;s recruiting profile.
      </Text>
      <EmailButton href={`${APP_URL}/team/players/${playerId}`}>View Profile</EmailButton>
    </EmailLayout>
  );
}
