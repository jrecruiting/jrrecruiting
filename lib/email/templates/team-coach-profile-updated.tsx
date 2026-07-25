import { Text } from "@react-email/components";
import { EmailLayout, EmailButton, emailTextStyle } from "./layout";
import { APP_URL } from "@/lib/email/resend";

export function TeamCoachProfileUpdatedEmail({
  playerId,
  playerName,
}: {
  playerId: string;
  playerName: string;
}) {
  return (
    <EmailLayout
      preview={`${playerName}'s profile was updated`}
      heading={`${playerName}'s profile was updated`}
    >
      <Text style={emailTextStyle}>
        <strong>{playerName}</strong>&apos;s recruiting profile was just updated. Take a look at
        what&apos;s new.
      </Text>
      <EmailButton href={`${APP_URL}/team/players/${playerId}`}>View Profile</EmailButton>
    </EmailLayout>
  );
}
