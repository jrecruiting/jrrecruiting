import { Text } from "@react-email/components";
import { EmailLayout, EmailButton, emailTextStyle } from "./layout";

export function VerifyEmailEmail({
  coachName,
  verifyUrl,
}: {
  coachName: string;
  verifyUrl: string;
}) {
  return (
    <EmailLayout preview="Confirm your email to finish signing up" heading="Confirm your email">
      <Text style={emailTextStyle}>
        Hi {coachName}, thanks for signing up as a coach on J.R. Recruiting. Please confirm
        your email address to finish creating your account. This link expires in 7 days.
      </Text>
      <EmailButton href={verifyUrl}>Confirm Email</EmailButton>
      <Text style={emailTextStyle}>
        After you confirm, our team will review your account before you can search full
        player profiles. If you didn&apos;t sign up, you can safely ignore this email.
      </Text>
    </EmailLayout>
  );
}
