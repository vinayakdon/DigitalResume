import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name} — AI & Data Engineer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const dots = Array.from({ length: 22 }, (_, i) => ({
    x: 760 + ((i * 97) % 340),
    y: 120 + ((i * 53) % 360),
    hot: i % 4 === 0,
  }));
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f4f6f9",
          color: "#18202e",
          padding: "72px 80px",
          position: "relative",
        }}
      >
        {dots.map((d, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: d.x,
              top: d.y,
              width: d.hot ? 14 : 8,
              height: d.hot ? 14 : 8,
              borderRadius: 999,
              background: d.hot ? "#2346d8" : "#b7c0cf",
            }}
          />
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 999,
              background: "#2346d8",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            {site.initials}
          </div>
          <div style={{ fontSize: 26, color: "#566074" }}>{site.location}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: -3, lineHeight: 1 }}>{site.name}</div>
          <div style={{ fontSize: 40, marginTop: 20 }}>{site.headline}</div>
          <div style={{ fontSize: 28, marginTop: 14, color: "#566074" }}>{site.focus.join("  /  ")}</div>
        </div>
      </div>
    ),
    size,
  );
}
