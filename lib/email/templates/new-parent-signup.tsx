import { Text } from "@react-email/components";
import { EmailLayout, EmailButton, emailTextStyle } from "./layout";
import { APP_URL } from "@/lib/email/resend";

export function NewParentSignupEmail({
  parentName,
  parentEmail,
}: {
  parentName: string;
  parentEmail: string;
}) {
  return (
    <EmailLayout
      preview={`${parentName} signed up as a parent`}
      heading="New parent account created"
    >
      <Text style={emailTextStyle}>
        <strong>{parentName}</strong> ({parentEmail}) just created a parent account. No action
        is needed from you yet -- you&apos;ll get a separate email once they add an athlete and
        the profile goes live.
      </Text>
      <EmailButton href={`${APP_URL}/admin/players`}>View Players</EmailButton>
    </EmailLayout>
  );
}
