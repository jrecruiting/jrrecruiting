import { Text } from "@react-email/components";
import { EmailLayout, EmailButton, emailTextStyle } from "./layout";
import { APP_URL } from "@/lib/email/resend";

export function CoachApprovedEmail({ coachName }: { coachName: string }) {
  return (
    <EmailLayout
      preview="Your J.R. Recruiting coach account is approved"
      heading="You're approved to search J.R. Recruiting"
    >
      <Text style={emailTextStyle}>Hi {coachName},</Text>
      <Text style={emailTextStyle}>
        Your coach account has been reviewed and approved. You can now search
        verified player profiles by state, country, sport, gender, position,
        and grad year.
      </Text>
      <EmailButton href={`${APP_URL}/search`}>Start Searching</EmailButton>
    </EmailLayout>
  );
}
