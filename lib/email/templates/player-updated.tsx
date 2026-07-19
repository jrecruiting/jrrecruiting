import { Text } from "@react-email/components";
import { EmailLayout, EmailButton, emailTextStyle } from "./layout";
import { APP_URL } from "@/lib/email/resend";

export function PlayerUpdatedEmail({
  playerId,
  playerName,
  coachName,
}: {
  playerId: string;
  playerName: string;
  coachName: string;
}) {
  return (
    <EmailLayout
      preview={`${playerName}'s profile was just updated`}
      heading={`${playerName}'s profile was updated`}
    >
      <Text style={emailTextStyle}>Hi {coachName},</Text>
      <Text style={emailTextStyle}>
        A player you starred, <strong>{playerName}</strong>, just updated their
        recruiting profile. Take a look at what&apos;s new.
      </Text>
      <EmailButton href={`${APP_URL}/players/${playerId}`}>View Profile</EmailButton>
    </EmailLayout>
  );
}
