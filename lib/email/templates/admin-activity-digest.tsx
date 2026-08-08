import { Section, Text } from "@react-email/components";
import { EmailLayout, EmailButton, emailTextStyle } from "./layout";
import { APP_URL } from "@/lib/email/resend";

const sectionHeadingStyle = {
  fontSize: "13px",
  fontWeight: 700,
  color: "#1b2a49",
  margin: "20px 0 8px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

const rowStyle = { ...emailTextStyle, margin: "0 0 6px" };

type DigestCoach = { name: string; email: string; organization: string };
type DigestEvent = { playerName: string; coachName: string };

export function AdminActivityDigestEmail({
  periodLabel,
  newCoaches,
  views,
  stars,
}: {
  periodLabel: string;
  newCoaches: DigestCoach[];
  views: DigestEvent[];
  stars: DigestEvent[];
}) {
  const isQuiet = newCoaches.length === 0 && views.length === 0 && stars.length === 0;

  return (
    <EmailLayout
      preview={`Coach activity summary for ${periodLabel}`}
      heading={`Coach activity: ${periodLabel}`}
    >
      {isQuiet ? (
        <Text style={emailTextStyle}>
          No new coach signups, profile views, or stars in this period.
        </Text>
      ) : (
        <>
          {newCoaches.length > 0 && (
            <Section>
              <Text style={sectionHeadingStyle}>
                New coaches ({newCoaches.length})
              </Text>
              {newCoaches.map((c, i) => (
                <Text key={i} style={rowStyle}>
                  {c.name} ({c.email}){c.organization ? ` — ${c.organization}` : ""}
                </Text>
              ))}
            </Section>
          )}

          {stars.length > 0 && (
            <Section>
              <Text style={sectionHeadingStyle}>Stars ({stars.length})</Text>
              {stars.map((s, i) => (
                <Text key={i} style={rowStyle}>
                  {s.coachName} starred {s.playerName}
                </Text>
              ))}
            </Section>
          )}

          {views.length > 0 && (
            <Section>
              <Text style={sectionHeadingStyle}>Profile views ({views.length})</Text>
              {views.map((v, i) => (
                <Text key={i} style={rowStyle}>
                  {v.coachName} viewed {v.playerName}
                </Text>
              ))}
            </Section>
          )}
        </>
      )}

      <EmailButton href={`${APP_URL}/admin/profile-views`}>View Full Activity</EmailButton>
    </EmailLayout>
  );
}
