import { Text } from "@react-email/components";
import { EmailLayout, EmailButton, emailTextStyle } from "./layout";

export function TeamCoachInviteEmail({
  coachName,
  playerName,
  setupUrl,
}: {
  coachName: string;
  playerName: string;
  setupUrl: string;
}) {
  return (
    <EmailLayout
      preview={`You've been given access to ${playerName}'s recruiting profile`}
      heading="You've been given profile access"
    >
      <Text style={emailTextStyle}>Hi {coachName},</Text>
      <Text style={emailTextStyle}>
        J.R. Recruiting has set you up with an account so you can follow{" "}
        <strong>{playerName}</strong>&apos;s recruiting profile -- see updates and know when a
        college coach reviews it. Click below to set your password and sign in. This link
        expires in 1 hour.
      </Text>
      <EmailButton href={setupUrl}>Set Up Your Account</EmailButton>
    </EmailLayout>
  );
}
