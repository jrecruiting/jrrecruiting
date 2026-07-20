import { Text } from "@react-email/components";
import { EmailLayout, EmailButton, emailTextStyle } from "./layout";

export function PasswordResetEmail({ resetUrl }: { resetUrl: string }) {
  return (
    <EmailLayout
      preview="Reset your J.R. Recruiting password"
      heading="Reset your password"
    >
      <Text style={emailTextStyle}>
        We received a request to reset your password. Click the button below
        to choose a new one. This link expires in 1 hour.
      </Text>
      <EmailButton href={resetUrl}>Reset Password</EmailButton>
      <Text style={emailTextStyle}>
        If you didn&apos;t request this, you can safely ignore this email
        &mdash; your password won&apos;t be changed.
      </Text>
    </EmailLayout>
  );
}
