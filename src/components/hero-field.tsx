/**
 * Decorative background for the hero: a quiet "embedding space" of points with a
 * few highlighted clusters, faded out towards the edges. Deterministic, no JS.
 */
function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

const r = rng(7);
const clusters = [
  { x: 980, y: 170, c: "var(--cat-ai)" },
  { x: 1180, y: 420, c: "var(--cat-bi)" },
  { x: 760, y: 470, c: "var(--cat-ml)" },
];
const points = [
  ...Array.from({ length: 220 }, () => ({ x: r() * 1400, y: r() * 640, rad: 1 + r() * 1.4, c: "var(--muted)", o: 0.18 + r() * 0.2 })),
  ...clusters.flatMap((k) =>
    Array.from({ length: 26 }, () => {
      const a = r() * Math.PI * 2;
      const d = Math.sqrt(r()) * 70;
      return { x: k.x + Math.cos(a) * d, y: k.y + Math.sin(a) * d, rad: 1.6 + r() * 1.6, c: k.c, o: 0.5 + r() * 0.35 };
    }),
  ),
];

export function HeroField() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <svg
        viewBox="0 0 1400 640"
        preserveAspectRatio="xMidYMid slice"
        className="size-full"
        style={{
          maskImage: "radial-gradient(ellipse 70% 75% at 70% 45%, black 20%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 75% at 70% 45%, black 20%, transparent 75%)",
        }}
      >
        {clusters.map((k) => (
          <circle key={k.x} cx={k.x} cy={k.y} r="110" style={{ fill: k.c }} opacity="0.06" />
        ))}
        {points.map((p, i) => (
          <circle key={i} cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r={p.rad.toFixed(2)} style={{ fill: p.c }} opacity={p.o.toFixed(2)} />
        ))}
      </svg>
    </div>
  );
}
