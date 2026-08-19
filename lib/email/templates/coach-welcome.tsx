import { Text } from "@react-email/components";
import { EmailLayout, EmailButton, emailTextStyle } from "./layout";

export function CoachWelcomeEmail({
  coachName,
  setPasswordUrl,
}: {
  coachName: string;
  setPasswordUrl: string;
}) {
  return (
    <EmailLayout
      preview="Your J.R. Recruiting coach account is ready"
      heading="Your coach account is ready"
    >
      <Text style={emailTextStyle}>
        Hi {coachName}, we&apos;ve set up your J.R. Recruiting coach account with full
        search access &mdash; no waiting on approval. Set a password to sign in.
      </Text>
      <EmailButton href={setPasswordUrl}>Set Your Password</EmailButton>
      <Text style={emailTextStyle}>This link expires in 7 days.</Text>
    </EmailLayout>
  );
}
