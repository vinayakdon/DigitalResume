/**
 * Project covers drawn as theme-aware SVG. Every number shown comes from the
 * project's repository: notebook outputs, the bundled datasets, the test run
 * or the source code (routes, modules). Nothing here is invented.
 */
import type { ReactNode } from "react";
import { categoryColor } from "@/content/categories";
import type { Project } from "@/content/types";

const W = 640;
const H = 360;
const MUTED = "var(--muted)";
const INK = "var(--ink)";
const LINE = "var(--line)";
const SURFACE = "var(--surface)";

export const tint = (c: string, pct: number) => `color-mix(in oklab, ${c} ${pct}%, var(--surface))`;
const fmt = (n: number) => n.toLocaleString("en-US");

function Frame({ c, label, title, note, children }: { c: string; label: string; title: string; note?: string; children: ReactNode }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="block size-full" style={{ fontFamily: "var(--font-sans)" }}>
      <rect width={W} height={H} style={{ fill: tint(c, 7) }} />
      <text x="28" y="40" fontSize="16" fontWeight="600" fill={INK}>
        {title}
      </text>
      {note && (
        <text x={W - 28} y="40" fontSize="13" fill={MUTED} textAnchor="end">
          {note}
        </text>
      )}
      {children}
    </svg>
  );
}

export function Arrow({ x1, y1, x2, y2, color = MUTED }: { x1: number; y1: number; x2: number; y2: number; color?: string }) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const s = 7;
  const p1 = [x2 - s * Math.cos(a - 0.45), y2 - s * Math.sin(a - 0.45)];
  const p2 = [x2 - s * Math.cos(a + 0.45), y2 - s * Math.sin(a + 0.45)];
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2 - 2 * Math.cos(a)} y2={y2 - 2 * Math.sin(a)} stroke={color} strokeWidth="1.6" />
      <polygon points={`${x2},${y2} ${p1[0]},${p1[1]} ${p2[0]},${p2[1]}`} fill={color} />
    </g>
  );
}

export function Box({
  x,
  y,
  w,
  h,
  title,
  sub,
  c,
  strong = false,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  sub?: string;
  c: string;
  strong?: boolean;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="10" style={{ fill: strong ? c : SURFACE }} stroke={strong ? c : LINE} />
      <text x={x + w / 2} y={y + (sub ? h / 2 - 3 : h / 2 + 5)} fontSize="14" fontWeight="600" textAnchor="middle" fill={strong ? SURFACE : INK}>
        {title}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 15} fontSize="11.5" textAnchor="middle" fill={strong ? SURFACE : MUTED}>
          {sub}
        </text>
      )}
    </g>
  );
}

function Matrix({
  x,
  y,
  cells,
  c,
  labels = ["Real", "Fake"],
}: {
  x: number;
  y: number;
  cells: [[number, number], [number, number]];
  c: string;
  labels?: [string, string];
}) {
  const cw = 104;
  const ch = 78;
  const max = Math.max(...cells.flat());
  return (
    <g>
      <text x={x + cw} y={y - 30} fontSize="12" fill={MUTED} textAnchor="middle">
        Predicted
      </text>
      {labels.map((l, i) => (
        <text key={l} x={x + cw / 2 + i * cw} y={y - 10} fontSize="12" fill={MUTED} textAnchor="middle">
          {l}
        </text>
      ))}
      <text x={x - 44} y={y + ch} fontSize="12" fill={MUTED} textAnchor="middle" transform={`rotate(-90 ${x - 44} ${y + ch})`}>
        Actual
      </text>
      {labels.map((l, i) => (
        <text key={l} x={x - 12} y={y + ch / 2 + 4 + i * ch} fontSize="12" fill={MUTED} textAnchor="end">
          {l}
        </text>
      ))}
      {cells.map((row, r) =>
        row.map((v, k) => {
          const correct = r === k;
          const pct = correct ? 18 + 60 * Math.sqrt(v / max) : v === 0 ? 0 : 12;
          return (
            <g key={`${r}${k}`}>
              <rect
                x={x + k * cw}
                y={y + r * ch}
                width={cw - 4}
                height={ch - 4}
                rx="8"
                style={{ fill: correct ? tint(c, pct) : tint("var(--signal)", pct) }}
                stroke={LINE}
              />
              <text x={x + k * cw + (cw - 4) / 2} y={y + r * ch + ch / 2 + 5} fontSize="20" fontWeight="600" textAnchor="middle" fill={INK}>
                {fmt(v)}
              </text>
            </g>
          );
        }),
      )}
    </g>
  );
}

function HBars({
  x,
  y,
  w,
  rows,
  c,
  max,
  format = (v: number) => v.toFixed(2),
  labelW = 120,
  gap = 34,
}: {
  x: number;
  y: number;
  w: number;
  rows: { label: string; value: number; highlight?: boolean }[];
  c: string;
  max: number;
  format?: (v: number) => string;
  labelW?: number;
  gap?: number;
}) {
  return (
    <g>
      {rows.map((r, i) => {
        const bw = ((w - labelW - 50) * r.value) / max;
        const yy = y + i * gap;
        return (
          <g key={r.label}>
            <text x={x} y={yy + 13} fontSize="13" fill={r.highlight ? INK : MUTED} fontWeight={r.highlight ? 600 : 400}>
              {r.label}
            </text>
            <rect x={x + labelW} y={yy} width={w - labelW - 50} height="18" rx="4" fill={LINE} opacity="0.5" />
            <rect x={x + labelW} y={yy} width={Math.max(3, bw)} height="18" rx="4" style={{ fill: r.highlight ? c : tint(c, 45) }} />
            <text x={x + labelW + bw + 8} y={yy + 14} fontSize="13" fontWeight="600" fill={INK}>
              {format(r.value)}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function linePath(values: number[], x0: number, x1: number, y0: number, y1: number, max: number) {
  const step = (x1 - x0) / (values.length - 1);
  return values.map((v, i) => `${i ? "L" : "M"}${(x0 + i * step).toFixed(1)},${(y1 - ((y1 - y0) * v) / max).toFixed(1)}`).join(" ");
}

/* ── One visual per project ──────────────────────────────────── */

function RagScheduler({ c }: { c: string }) {
  const xs = [26, 148, 270, 392, 514];
  const bw = 100;
  return (
    <Frame c={c} label="RAG-Scheduler architecture: CSV rows are embedded into an HNSWLib index; questions retrieve top-k rows that a local Ollama model answers from." title="Retrieval-augmented generation, fully local" note="no API keys">
      <text x="26" y="78" fontSize="12" fill={MUTED}>
        Ingest, once per timetable
      </text>
      <Box x={xs[0]} y={88} w={bw} h={58} title="CSV upload" sub="Multer" c={c} />
      <Box x={xs[1]} y={88} w={bw} h={58} title="Embed rows" sub="MiniLM, 384-d" c={c} />
      <Box x={xs[2]} y={88} w={bw} h={58} title="HNSWLib" sub="index on disk" c={c} strong />
      <Arrow x1={xs[0] + bw} y1={117} x2={xs[1]} y2={117} />
      <Arrow x1={xs[1] + bw} y1={117} x2={xs[2]} y2={117} />

      <text x="26" y="218" fontSize="12" fill={MUTED}>
        Ask, per question
      </text>
      <Box x={xs[0]} y={228} w={bw} h={58} title="Question" sub="“What’s on Tue?”" c={c} />
      <Box x={xs[1]} y={228} w={bw} h={58} title="Embed query" sub="same model" c={c} />
      <Box x={xs[2]} y={228} w={bw} h={58} title="Top-k rows" sub="cosine search" c={c} />
      <Box x={xs[3]} y={228} w={bw} h={58} title="Ollama LLM" sub="grounded prompt" c={c} />
      <Box x={xs[4]} y={228} w={bw} h={58} title="Answer" sub="+ source rows" c={c} strong />
      {[0, 1, 2, 3].map((i) => (
        <Arrow key={i} x1={xs[i] + bw} y1={257} x2={xs[i + 1]} y2={257} />
      ))}
      <Arrow x1={xs[2] + bw / 2} y1={146} x2={xs[2] + bw / 2} y2={228} color={c} />
      <text x={xs[2] + bw / 2 + 10} y={192} fontSize="12" fill={MUTED}>
        nearest neighbours
      </text>
      <text x="26" y="326" fontSize="12" fill={MUTED}>
        React + Vite frontend, Express API: /status, /ingest, /ask
      </text>
    </Frame>
  );
}

function FakeJob({ c }: { c: string }) {
  return (
    <Frame c={c} label="Fake job detection results: LinearSVC confusion matrix with 145 of 173 fake postings caught and 8 false alarms; F1 scores for four models." title="LinearSVC on 3,576 held-out postings" note="from the notebook">
      <Matrix x={86} y={120} c={c} cells={[[3395, 8], [28, 145]]} />
      <text x="360" y="104" fontSize="13" fontWeight="600" fill={INK}>
        F1 on the fake class
      </text>
      <HBars
        x={360}
        y={122}
        w={260}
        c={c}
        max={1}
        labelW={110}
        rows={[
          { label: "LinearSVC", value: 0.8896, highlight: true },
          { label: "Logistic Reg.", value: 0.8603 },
          { label: "Random Forest", value: 0.7527 },
          { label: "Multinomial NB", value: 0.4741 },
        ]}
      />
      <text x="360" y="290" fontSize="12" fill={MUTED}>
        Only ~5% of postings are fake, so F1
      </text>
      <text x="360" y="306" fontSize="12" fill={MUTED}>
        beats accuracy for choosing a model.
      </text>
    </Frame>
  );
}

function Spam({ c }: { c: string }) {
  const ham = 87.37;
  return (
    <Frame c={c} label="Spam classifier results: Multinomial Naive Bayes confusion matrix with zero false positives; dataset is 87% ham and 13% spam." title="Multinomial Naive Bayes + TF-IDF" note="1,034 test messages">
      <Matrix x={86} y={120} c={c} cells={[[896, 0], [30, 108]]} labels={["Ham", "Spam"]} />
      <text x="360" y="112" fontSize="13" fontWeight="600" fill={INK}>
        Dataset balance
      </text>
      <rect x="360" y="124" width="252" height="22" rx="5" style={{ fill: tint(c, 30) }} />
      <rect x={360 + (252 * ham) / 100} y="124" width={(252 * (100 - ham)) / 100} height="22" rx="5" fill="var(--signal)" />
      <text x="360" y="166" fontSize="12" fill={MUTED}>
        Ham 87.4%
      </text>
      <text x="612" y="166" fontSize="12" fill={MUTED} textAnchor="end">
        Spam 12.6%
      </text>
      <text x="360" y="222" fontSize="34" fontWeight="600" fill={c}>
        1.00
      </text>
      <text x="360" y="244" fontSize="13" fill={MUTED}>
        precision: no real message flagged
      </text>
      <text x="360" y="292" fontSize="34" fontWeight="600" fill={INK}>
        97.1%
      </text>
      <text x="360" y="314" fontSize="13" fill={MUTED}>
        accuracy
      </text>
    </Frame>
  );
}

function Spotify({ c }: { c: string }) {
  const rows: [string, number][] = [
    ["Energy", 0.3],
    ["Danceability", 0.19],
    ["Tempo", 0.071],
    ["Valence", 0.0046],
    ["Duration", -0.028],
    ["Speechiness", -0.047],
    ["Liveness", -0.049],
    ["Instrumentalness", -0.24],
    ["Acousticness", -0.37],
  ];
  const cx = 360;
  const scale = 230 / 0.4;
  return (
    <Frame c={c} label="Correlation of Spotify audio features with track popularity: energy +0.30 and danceability +0.19 highest; acousticness −0.37 lowest." title="What moves popularity?" note="correlation with popularity">
      <line x1={cx} y1={62} x2={cx} y2={334} stroke={LINE} strokeWidth="1.5" />
      {rows.map(([label, v], i) => {
        const y = 68 + i * 29;
        const w = Math.abs(v) * scale;
        const pos = v >= 0;
        return (
          <g key={label}>
            <text x={cx - 12 - (pos ? 0 : w)} y={y + 14} fontSize="13" fill={MUTED} textAnchor="end">
              {label}
            </text>
            <rect x={pos ? cx : cx - w} y={y} width={Math.max(2, w)} height="18" rx="4" style={{ fill: pos ? c : tint(c, 40) }} />
            <text x={pos ? cx + w + 8 : cx + 8} y={y + 14} fontSize="12.5" fontWeight="600" fill={INK}>
              {v > 0 ? "+" : ""}
              {v.toFixed(2)}
            </text>
          </g>
        );
      })}
    </Frame>
  );
}

function Loan({ c }: { c: string }) {
  const kpis = [
    ["Applications", "38,576"],
    ["Funded", "$435.8M"],
    ["Received", "$473.1M"],
    ["Avg. interest", "12.05%"],
  ];
  const status = [
    { label: "Fully paid", v: 32145, fill: c },
    { label: "Charged off", v: 5333, fill: "var(--signal)" },
    { label: "Current", v: 1098, fill: MUTED },
  ];
  const total = 38576;
  const monthly = [2332, 2279, 2627, 2755, 2911, 3184, 3366, 3441, 3536, 3796, 4035, 4314];
  let acc = 0;
  return (
    <Frame c={c} label="Bank loan portfolio 2021: 38,576 applications, $435.8M funded, $473.1M received, 12.05% average interest; 83% fully paid." title="Bank loan portfolio, 2021" note="38,576 loans">
      {kpis.map(([l, v], i) => (
        <g key={l}>
          <rect x={28 + i * 148} y={62} width={136} height={70} rx="10" fill={SURFACE} stroke={LINE} />
          <text x={42 + i * 148} y={86} fontSize="12" fill={MUTED}>
            {l}
          </text>
          <text x={42 + i * 148} y={116} fontSize="22" fontWeight="600" fill={INK}>
            {v}
          </text>
        </g>
      ))}
      <text x="28" y="168" fontSize="13" fontWeight="600" fill={INK}>
        Loan status
      </text>
      {status.map((s) => {
        const w = (580 * s.v) / total;
        const x = 28 + acc;
        acc += w;
        return <rect key={s.label} x={x} y={180} width={w} height={20} style={{ fill: s.fill }} />;
      })}
      {status.map((s, i) => (
        <text key={s.label} x={28 + i * 170} y={222} fontSize="12" fill={MUTED}>
          {s.label} {fmt(s.v)}
        </text>
      ))}
      <text x="28" y="262" fontSize="13" fontWeight="600" fill={INK}>
        Applications by month
      </text>
      <path d={`${linePath(monthly, 28, 608, 272, 330, 4600)} L608,334 L28,334 Z`} style={{ fill: tint(c, 25) }} />
      <path d={linePath(monthly, 28, 608, 272, 330, 4600)} fill="none" stroke={c} strokeWidth="2.5" />
    </Frame>
  );
}

function Bike({ c }: { c: string }) {
  const work = [37, 16, 8, 5, 5, 25, 103, 291, 480, 242, 134, 157, 199, 197, 180, 199, 292, 529, 495, 349, 249, 185, 138, 89];
  const off = [94, 72, 54, 26, 9, 9, 20, 47, 112, 178, 264, 325, 379, 388, 379, 374, 368, 339, 292, 242, 184, 149, 123, 91];
  const x0 = 56;
  const x1 = 612;
  const y0 = 70;
  const y1 = 312;
  const max = 560;
  return (
    <Frame c={c} label="Mean hourly bike rentals: working days peak at 8:00 and 17:00 (480 and 529); non-working days peak around midday." title="Mean rentals per hour" note="10,886 hourly records">
      {[0, 200, 400].map((g) => {
        const y = y1 - ((y1 - y0) * g) / max;
        return (
          <g key={g}>
            <line x1={x0} x2={x1} y1={y} y2={y} stroke={LINE} />
            <text x={x0 - 8} y={y + 4} fontSize="11" fill={MUTED} textAnchor="end">
              {g}
            </text>
          </g>
        );
      })}
      {[0, 6, 12, 18, 23].map((h) => (
        <text key={h} x={x0 + ((x1 - x0) * h) / 23} y={332} fontSize="11" fill={MUTED} textAnchor="middle">
          {h}:00
        </text>
      ))}
      <path d={linePath(off, x0, x1, y0, y1, max)} fill="none" stroke={MUTED} strokeWidth="2.5" strokeDasharray="5 4" />
      <path d={linePath(work, x0, x1, y0, y1, max)} fill="none" stroke={c} strokeWidth="3" />
      <text x={x0 + ((x1 - x0) * 8) / 23 + 10} y={y1 - ((y1 - y0) * 480) / max} fontSize="12" fill={INK}>
        8:00 commute
      </text>
      <text x={x0 + ((x1 - x0) * 17) / 23 + 12} y={y1 - ((y1 - y0) * 529) / max + 6} fontSize="12" fill={INK}>
        17:00
      </text>
      <rect x="372" y="54" width="14" height="3" style={{ fill: c }} />
      <text x="392" y="59" fontSize="12" fill={MUTED}>
        Working days
      </text>
      <rect x="486" y="54" width="14" height="3" fill={MUTED} />
      <text x="506" y="59" fontSize="12" fill={MUTED}>
        Weekends, holidays
      </text>
    </Frame>
  );
}

function Ecommerce({ c }: { c: string }) {
  const pay = [
    ["COD", 155181],
    ["Credit card", 86932],
    ["EMI", 77881],
    ["UPI", 68641],
    ["Debit card", 49136],
  ] as const;
  const tot = pay.reduce((s, [, v]) => s + v, 0);
  let acc = 0;
  return (
    <Frame c={c} label="E-commerce sales by category: Electronics 166,267, Clothing 144,323, Furniture 127,181; cash on delivery is the largest payment mode." title="Sales amount by category" note="Orders.csv + Details.csv">
      <HBars
        x={28}
        y={72}
        w={600}
        c={c}
        max={170000}
        gap={38}
        labelW={110}
        format={fmt}
        rows={[
          { label: "Electronics", value: 166267, highlight: true },
          { label: "Clothing", value: 144323 },
          { label: "Furniture", value: 127181 },
        ]}
      />
      <text x="28" y="222" fontSize="13" fontWeight="600" fill={INK}>
        Payment mode share
      </text>
      {pay.map(([l, v], i) => {
        const w = (584 * v) / tot;
        const x = 28 + acc;
        acc += w;
        return (
          <g key={l}>
            <rect x={x} y={234} width={w - 2} height={26} rx="4" style={{ fill: i === 0 ? c : tint(c, 70 - i * 12) }} />
            <text x={x + 4} y={282} fontSize="12" fill={MUTED}>
              {l}
            </text>
            <text x={x + 4} y={299} fontSize="12" fontWeight="600" fill={INK}>
              {Math.round((100 * v) / tot)}%
            </text>
          </g>
        );
      })}
    </Frame>
  );
}

function SuperStore({ c }: { c: string }) {
  const m = [18616, 19979, 51716, 38750, 50988, 40345, 39262, 31115, 73410, 42688, 79412, 78399, 54763, 52068, 64229, 50808, 66750, 69243, 60077, 77339, 119804, 88897, 130961, 166186];
  const x0 = 64;
  const x1 = 612;
  const y0 = 70;
  const y1 = 300;
  const max = 175000;
  return (
    <Frame c={c} label="SuperStore monthly sales, January 2019 to December 2020, rising to a peak of 166,186 in December 2020." title="Monthly sales, 2019–2020" note="5,901 orders">
      {[0, 50000, 100000, 150000].map((g) => {
        const y = y1 - ((y1 - y0) * g) / max;
        return (
          <g key={g}>
            <line x1={x0} x2={x1} y1={y} y2={y} stroke={LINE} />
            <text x={x0 - 8} y={y + 4} fontSize="11" fill={MUTED} textAnchor="end">
              {g / 1000}k
            </text>
          </g>
        );
      })}
      <path d={`${linePath(m, x0, x1, y0, y1, max)} L${x1},${y1} L${x0},${y1} Z`} style={{ fill: tint(c, 22) }} />
      <path d={linePath(m, x0, x1, y0, y1, max)} fill="none" stroke={c} strokeWidth="2.6" />
      <circle cx={x1} cy={y1 - ((y1 - y0) * 166186) / max} r="5" style={{ fill: c }} />
      <text x={x1 - 10} y={y1 - ((y1 - y0) * 166186) / max + 4} fontSize="12" fontWeight="600" fill={INK} textAnchor="end">
        166k, Dec 2020
      </text>
      {[
        ["Jan 2019", 0],
        ["Jan 2020", 12],
        ["Dec 2020", 23],
      ].map(([l, i]) => (
        <text key={l as string} x={x0 + ((x1 - x0) * (i as number)) / 23} y={322} fontSize="11" fill={MUTED} textAnchor={i === 23 ? "end" : "middle"}>
          {l}
        </text>
      ))}
    </Frame>
  );
}

function DataCleaning({ c }: { c: string }) {
  // salesdata.xlsx from the repo: 24 rows → 4 duplicates, 5 incomplete rows, 15 clean; 10 numeric gaps filled.
  const fate = [...Array(15).fill("clean"), ...Array(4).fill("dup"), ...Array(5).fill("drop")];
  const order = [0, 15, 1, 2, 19, 3, 16, 4, 5, 20, 6, 7, 17, 8, 21, 9, 10, 18, 11, 22, 12, 13, 23, 14];
  const filled = new Set([1, 4, 7, 9, 12, 14, 16, 19, 21, 23]);
  return (
    <Frame c={c} label="Data cleaning run on salesdata.xlsx: 24 rows loaded, 4 duplicates backed up, 10 numeric gaps filled with the mean, 5 incomplete rows dropped, 15 clean rows saved." title="One run on salesdata.xlsx" note="10 columns">
      {order.map((idx, i) => {
        const f = fate[idx];
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = 28 + col * 136;
        const y = 62 + row * 22;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={128}
              height={16}
              rx="3"
              style={{ fill: f === "clean" ? tint(c, 55) : f === "dup" ? "var(--cat-ai)" : tint("var(--muted)", 30) }}
              opacity={f === "drop" ? 0.7 : 1}
            />
            {f === "drop" && <line x1={x + 6} x2={x + 122} y1={y + 8} y2={y + 8} stroke={MUTED} strokeWidth="1.5" />}
            {f === "clean" && filled.has(i) && <circle cx={x + 112} cy={y + 8} r="3.5" fill={SURFACE} />}
          </g>
        );
      })}
      {[
        ["24", "rows loaded", INK],
        ["4", "duplicates backed up", "var(--cat-ai)"],
        ["10", "numeric gaps filled (mean)", INK],
        ["5", "incomplete rows dropped", MUTED],
        ["15", "clean rows saved", c],
      ].map(([n, l, col], i) => (
        <g key={l}>
          <text x="330" y={92 + i * 52} fontSize="28" fontWeight="600" style={{ fill: col }}>
            {n}
          </text>
          <text x="376" y={88 + i * 52} fontSize="13" fill={MUTED}>
            {l}
          </text>
        </g>
      ))}
    </Frame>
  );
}

function ImageDownloader({ c }: { c: string }) {
  const tests = [
    ["test_url_reader.py", "skips_blank_lines_and_comments"],
    ["test_downloader.py", "downloads_and_saves_an_image"],
    ["test_downloader.py", "404_is_skipped"],
    ["test_downloader.py", "network_error_is_skipped"],
    ["test_downloader.py", "non_image_is_skipped"],
    ["test_downloader.py", "two_urls_with_same_name_do_not_overwrite"],
    ["test_cli.py", "missing_file_returns_exit_code_2"],
    ["test_cli.py", "full_run_downloads_and_returns_0"],
  ];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Terminal output of the Image Downloader test suite: 14 tests passed in 0.14 seconds." className="block size-full" style={{ fontFamily: "var(--font-mono)" }}>
      <rect width={W} height={H} fill="#11172a" />
      <rect width={W} height="34" fill="#1a2238" />
      {["#ff6b6b", "#f7c55c", "#4fd18b"].map((f, i) => (
        <circle key={f} cx={22 + i * 18} cy="17" r="5.5" fill={f} />
      ))}
      <text x={W / 2} y="22" fontSize="12" fill="#8b95ad" textAnchor="middle">
        image-downloader
      </text>
      <text x="24" y="66" fontSize="13.5" fill="#e5e9f2">
        <tspan fill="#8098ff">$</tspan> pytest -v
      </text>
      {tests.map(([f, t], i) => (
        <text key={t} x="24" y={96 + i * 24} fontSize="12.5" fill="#9aa4b8">
          <tspan>tests/{f}::</tspan>
          <tspan fill="#e5e9f2">{t.length > 30 ? t.slice(0, 29) + "…" : t}</tspan>
          <tspan x="560" fill="#4fd18b">
            PASSED
          </tspan>
        </text>
      ))}
      <text x="24" y="304" fontSize="12.5" fill="#9aa4b8">
        … 6 more
      </text>
      <rect x="0" y="318" width={W} height="42" style={{ fill: c }} opacity="0.18" />
      <text x="24" y="345" fontSize="15" fontWeight="700" fill="#4fd18b">
        14 passed
      </text>
      <text x="124" y="345" fontSize="15" fill="#e5e9f2">
        in 0.14s, fully offline (mocked HTTP)
      </text>
    </svg>
  );
}

function ProductStore({ c }: { c: string }) {
  const routes = ["GET  /getProducts", "POST /postProduct", "PUT  /update/:id", "DEL  /delete/:id"];
  return (
    <Frame c={c} label="ProductStore MERN architecture: React with Chakra UI and Zustand calls an Express REST API at /api/products, which uses Mongoose to store products in MongoDB." title="MERN product catalogue" note="React, Express, MongoDB">
      <Box x={28} y={110} w={150} h={84} title="React + Vite" sub="Chakra UI, Zustand" c={c} />
      <rect x={232} y={72} width={196} height={190} rx="12" fill={SURFACE} stroke={c} strokeWidth="1.5" />
      <text x={330} y={100} fontSize="14" fontWeight="600" fill={INK} textAnchor="middle">
        Express API
      </text>
      <text x={330} y={120} fontSize="12" fill={MUTED} textAnchor="middle">
        /api/products
      </text>
      {routes.map((r, i) => (
        <g key={r}>
          <rect x={248} y={136 + i * 29} width={164} height={22} rx="5" style={{ fill: tint(c, 14) }} />
          <text x={258} y={151 + i * 29} fontSize="12" fill={INK} style={{ fontFamily: "var(--font-mono)" }} xmlSpace="preserve">
            {r}
          </text>
        </g>
      ))}
      <Box x={482} y={80} w={130} h={60} title="Mongoose" sub="Product model" c={c} />
      <Box x={482} y={186} w={130} h={60} title="MongoDB" sub="products" c={c} strong />
      <Arrow x1={178} y1={152} x2={232} y2={152} />
      <Arrow x1={428} y1={110} x2={482} y2={110} />
      <Arrow x1={547} y1={140} x2={547} y2={186} />
      <text x="28" y="320" fontSize="12" fill={MUTED}>
        Create, list, update and delete products from a responsive UI
      </text>
    </Frame>
  );
}

function UserBackend({ c }: { c: string }) {
  const routes: [string, string][] = [
    ["GET", "/"],
    ["GET", "/read"],
    ["POST", "/create"],
    ["GET", "/edit/:userid"],
    ["POST", "/update/:userid"],
    ["GET", "/delete/:userid"],
  ];
  return (
    <Frame c={c} label="User management backend: six Express routes render EJS views and read and write users in MongoDB." title="Server-rendered CRUD" note="Express, EJS, MongoDB">
      {routes.map(([m, p], i) => (
        <g key={p}>
          <rect x={28} y={64 + i * 40} width={264} height={30} rx="6" fill={SURFACE} stroke={LINE} />
          <text x={40} y={84 + i * 40} fontSize="12" fontWeight="700" style={{ fill: m === "POST" ? "var(--signal)" : c, fontFamily: "var(--font-mono)" }}>
            {m}
          </text>
          <text x={92} y={84 + i * 40} fontSize="12.5" fill={INK} style={{ fontFamily: "var(--font-mono)" }}>
            {p}
          </text>
          <Arrow x1={292} y1={79 + i * 40} x2={352} y2={i < 3 ? 140 : 250} color={LINE} />
        </g>
      ))}
      <Box x={356} y={98} w={256} h={84} title="EJS views" sub="userform, usersProfile, editProfile" c={c} />
      <Box x={356} y={210} w={256} h={84} title="MongoDB" sub="userModel (Mongoose)" c={c} strong />
    </Frame>
  );
}

const visuals: Record<string, (p: { c: string }) => ReactNode> = {
  "rag-scheduler": RagScheduler,
  "fake-job-posting-detection": FakeJob,
  "email-sms-spam-classifier": Spam,
  "spotify-data-analysis": Spotify,
  "bank-loan-analysis": Loan,
  "bike-sharing-dashboard": Bike,
  "ecommerce-sales-dashboard": Ecommerce,
  "superstore-sales-dashboard": SuperStore,
  "data-cleaning-application": DataCleaning,
  "image-downloader-cli": ImageDownloader,
  "productstore-mern": ProductStore,
  "user-management-backend": UserBackend,
};

export function hasVisual(slug: string) {
  return slug in visuals;
}

export function ProjectVisual({ project }: { project: Project }) {
  const V = visuals[project.slug];
  if (!V) return null;
  return <V c={categoryColor[project.category]} />;
}
