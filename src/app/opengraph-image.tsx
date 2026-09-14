import { ImageResponse } from "next/og";
import { BRAND } from "@/lib/brand";

export const alt = `${BRAND.displayName} — ${BRAND.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #0b1220 0%, #0f1b2d 55%, #0a211e 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="72" height="72" viewBox="0 0 32 32" fill="none">
            <path d="M6.5 17.5 L13 24 L25.5 8.5" stroke="#ffffff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="6.5" cy="17.5" r="3.4" fill="#7cc3b3" />
            <circle cx="13" cy="24" r="3.4" fill="#ffffff" />
            <circle cx="19.25" cy="16.25" r="2.6" fill="#7cc3b3" />
            <circle cx="25.5" cy="8.5" r="3.4" fill="#ffffff" />
          </svg>
          <div style={{ display: "flex", fontSize: 44, fontWeight: 600, letterSpacing: -1.5 }}>
            <span>{BRAND.wordmark.a}</span>
            <span style={{ color: "#7cc3b3" }}>{BRAND.wordmark.b}</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ fontSize: 76, lineHeight: 1.02, letterSpacing: -3, fontWeight: 500, maxWidth: 1000 }}>
            Compare peptides.
            <br />
            Check your fit.
          </div>
          <div style={{ fontSize: 28, color: "rgba(255,255,255,0.72)", maxWidth: 940, lineHeight: 1.35 }}>
            Evidence grades, regulatory status and a personal suitability report you can take to a clinician.
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 14 }}>
            {["Strong", "Moderate", "Limited", "Preliminary", "Insufficient"].map((label, i) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 18px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(255,255,255,0.05)",
                  fontSize: 20,
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 999,
                    background: ["#34d399", "#2dd4bf", "#fbbf24", "#fb923c", "#94a3b8"][i],
                  }}
                />
                {label}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 22, color: "rgba(255,255,255,0.55)", letterSpacing: 2 }}>{BRAND.domain.toUpperCase()}</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
