import { Text } from "@react-email/components";
import { EmailLayout, EmailButton, emailTextStyle } from "./layout";
import { APP_URL } from "@/lib/email/resend";

export function ListingPaidEmail({ playerName }: { playerName: string }) {
  return (
    <EmailLayout
      preview={`${playerName}'s profile is now live`}
      heading={`${playerName}'s profile is live!`}
    >
      <Text style={emailTextStyle}>
        Payment received &mdash; <strong>{playerName}</strong>&apos;s profile
        is now searchable by verified college coaches.
      </Text>
      <EmailButton href={`${APP_URL}/dashboard`}>View Dashboard</EmailButton>
    </EmailLayout>
  );
}
