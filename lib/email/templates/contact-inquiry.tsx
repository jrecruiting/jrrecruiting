import { Text } from "@react-email/components";
import { EmailLayout, emailTextStyle } from "./layout";

export function ContactInquiryEmail({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) {
  return (
    <EmailLayout
      preview={`New contact form message from ${name}`}
      heading="New contact form message"
    >
      <Text style={emailTextStyle}>
        <strong>From:</strong> {name} ({email})
      </Text>
      <Text style={emailTextStyle}>{message}</Text>
    </EmailLayout>
  );
}
