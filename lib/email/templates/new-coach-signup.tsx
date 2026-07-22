import { Text } from "@react-email/components";
import { EmailLayout, EmailButton, emailTextStyle } from "./layout";
import { APP_URL } from "@/lib/email/resend";

export function NewCoachSignupEmail({
  coachName,
  coachEmail,
  organization,
}: {
  coachName: string;
  coachEmail: string;
  organization: string;
}) {
  return (
    <EmailLayout
      preview={`${coachName} signed up as a coach, pending approval`}
      heading="New coach account pending approval"
    >
      <Text style={emailTextStyle}>
        <strong>{coachName}</strong> ({coachEmail}) from <strong>{organization || "—"}</strong>{" "}
        just created a coach account and is waiting on verification before they can search
        full player profiles.
      </Text>
      <EmailButton href={`${APP_URL}/admin/coaches`}>Review Coach</EmailButton>
    </EmailLayout>
  );
}
