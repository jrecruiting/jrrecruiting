import { Text } from "@react-email/components";
import { EmailLayout, EmailButton, emailTextStyle } from "./layout";
import { APP_URL } from "@/lib/email/resend";

export function NewSchoolInterestSubmittedEmail({
  playerName,
  schoolName,
  submitterName,
  submitterEmail,
}: {
  playerName: string;
  schoolName: string;
  submitterName: string;
  submitterEmail: string;
}) {
  return (
    <EmailLayout
      preview={`${submitterName} added ${schoolName} as in contact with ${playerName}`}
      heading="New school in contact submitted"
    >
      <Text style={emailTextStyle}>
        <strong>{submitterName}</strong> ({submitterEmail}) added <strong>{schoolName}</strong> as
        a school currently in contact with <strong>{playerName}</strong>. It won&apos;t show on
        the profile until you review it.
      </Text>
      <EmailButton href={`${APP_URL}/admin/school-interest`}>Review</EmailButton>
    </EmailLayout>
  );
}
