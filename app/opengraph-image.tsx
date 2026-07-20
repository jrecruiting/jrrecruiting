import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const NAVY = "#0b1220";
const GOLD = "#c99a3a";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: NAVY,
          backgroundImage: `radial-gradient(60% 50% at 50% 0%, ${GOLD}33, transparent)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <span style={{ fontSize: 96, fontWeight: 700, color: GOLD }}>J.R.</span>
          <span style={{ width: 3, height: 64, background: "#ffffff40" }} />
          <span
            style={{
              fontSize: 52,
              fontWeight: 600,
              letterSpacing: 6,
              color: "#ffffff",
              textTransform: "uppercase",
            }}
          >
            Recruiting
          </span>
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 28,
            color: "#c8ccd6",
            display: "flex",
          }}
        >
          Connecting student-athletes with college coaches
        </div>
      </div>
    ),
    { ...size }
  );
}
