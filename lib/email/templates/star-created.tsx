import { Text } from "@react-email/components";
import { EmailLayout, EmailButton, emailTextStyle } from "./layout";
import { APP_URL } from "@/lib/email/resend";

export function StarCreatedEmail({
  playerId,
  playerName,
  coachName,
  organization,
}: {
  playerId: string;
  playerName: string;
  coachName: string;
  organization: string;
}) {
  return (
    <EmailLayout
      preview={`${coachName} starred ${playerName}`}
      heading="A coach starred one of your athletes"
    >
      <Text style={emailTextStyle}>
        <strong>{coachName}</strong>
        {organization ? ` (${organization})` : ""} just starred{" "}
        <strong>{playerName}</strong>&apos;s profile &mdash; the strongest signal of real
        interest a coach can give.
      </Text>
      <EmailButton href={`${APP_URL}/admin/players/${playerId}/edit`}>
        View Player
      </EmailButton>
    </EmailLayout>
  );
}
