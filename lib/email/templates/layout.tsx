import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { ReactNode } from "react";

const NAVY = "#1b2a49";
const GOLD = "#c99a3a";
const MUTED = "#6b7280";

export function EmailLayout({
  preview,
  heading,
  children,
}: {
  preview: string;
  heading: string;
  children: ReactNode;
}) {
  return (
    <Html>
      <Head>
        {/* This template is deliberately light-themed and isn't designed
            to survive automatic recoloring -- without this, some clients
            (seen with Gmail's iOS app) apply their own dark-mode inversion
            to the raw HTML, which can visibly break specific elements
            (e.g. a colored button losing contrast, or its containing
            table failing to render) in ways that are otherwise very hard
            to reproduce or debug. This opts the whole email out of that
            automatic reprocessing. */}
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
      </Head>
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: "#f4f4f5", fontFamily: "Helvetica, Arial, sans-serif" }}>
        <Container
          style={{
            backgroundColor: "#ffffff",
            margin: "40px auto",
            padding: "32px",
            borderRadius: "12px",
            maxWidth: "480px",
          }}
        >
          <Text
            style={{
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "1px",
              color: NAVY,
              margin: "0 0 24px",
            }}
          >
            J.R. <span style={{ color: GOLD }}>RECRUITING</span>
          </Text>

          <Heading
            style={{ fontSize: "20px", color: NAVY, margin: "0 0 16px", lineHeight: 1.3 }}
          >
            {heading}
          </Heading>

          {children}

          <Hr style={{ borderColor: "#e5e7eb", margin: "32px 0 16px" }} />
          <Text style={{ fontSize: "12px", color: MUTED, margin: 0 }}>
            J.R. Recruiting &middot; You&apos;re receiving this because of activity on your
            account.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export function EmailButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <>
      <Section style={{ margin: "24px 0 12px" }}>
        <a
          href={href}
          style={{
            backgroundColor: GOLD,
            color: "#1a1204",
            padding: "12px 20px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: 700,
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          {children}
        </a>
      </Section>
      {/* A true sibling of the Section above, not nested inside it --
          some mail apps (seen with Gmail's iOS app in dark mode) fail to
          render the styled button's table at all, dropping it and
          everything inside that same table with no visible error. Kept
          as its own top-level element so it survives even when that
          happens, instead of being dropped along with the button. */}
      <Text style={{ fontSize: "12px", color: MUTED, margin: "0 0 16px" }}>
        Or copy and paste this link into your browser:{" "}
        <a href={href} style={{ color: GOLD }}>
          {href}
        </a>
      </Text>
    </>
  );
}

export const emailTextStyle = { fontSize: "14px", color: "#374151", lineHeight: 1.6 };
