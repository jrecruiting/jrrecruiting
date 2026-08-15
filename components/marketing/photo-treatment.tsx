// Unifies photos of wildly varying quality (phone snapshots, different
// lighting, different seasons) into one visual signature: a gold/navy grade
// tying every photo to the brand palette, a vignette, and fine grain to mask
// compression/phone-camera softness. Apply PHOTO_GRADE_FILTER to the <img>
// itself and stack this overlay on top of it.
export const PHOTO_GRADE_FILTER = "grayscale(38%) saturate(0.82) contrast(1.1) brightness(0.86)";

export function PhotoTreatmentOverlay({ fadeBottom = false }: { fadeBottom?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 30% 15%, color-mix(in oklch, var(--gold), transparent 84%), transparent 55%), linear-gradient(165deg, color-mix(in oklch, var(--gold), transparent 70%) 0%, color-mix(in oklch, var(--background), transparent 90%) 45%, color-mix(in oklch, var(--background), transparent 45%) 100%)",
          mixBlendMode: "multiply",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklch, var(--gold), transparent 90%) 0%, transparent 30%)",
          mixBlendMode: "soft-light",
        }}
      />
      <div
        className="absolute inset-0"
        style={{ boxShadow: "inset 0 0 6rem 1.5rem color-mix(in oklch, var(--background), transparent 15%)" }}
      />
      <div
        className="absolute inset-0 opacity-[0.16] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
        }}
      />
      {fadeBottom && (
        <div
          className="absolute inset-x-0 bottom-0 h-[42%]"
          style={{ background: "linear-gradient(180deg, transparent 0%, var(--background) 100%)" }}
        />
      )}
    </div>
  );
}
