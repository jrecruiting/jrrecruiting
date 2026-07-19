import { Text } from "@react-email/components";
import { EmailLayout, emailTextStyle } from "./layout";

export function CoachRejectedEmail({
  coachName,
  reason,
}: {
  coachName: string;
  reason?: string | null;
}) {
  return (
    <EmailLayout
      preview="Update on your J.R. Recruiting coach application"
      heading="Update on your coach application"
    >
      <Text style={emailTextStyle}>Hi {coachName},</Text>
      <Text style={emailTextStyle}>
        Thanks for your interest in J.R. Recruiting. After review, we
        weren&apos;t able to verify your coach account at this time
        {reason ? `: ${reason}` : "."}
      </Text>
      <Text style={emailTextStyle}>
        If you believe this was a mistake, reply to this email and we&apos;ll
        take another look.
      </Text>
    </EmailLayout>
  );
}
