import { Arrow, Box, tint } from "./project-visuals";

/** The thesis pipeline as described in the paper: local RAG plus a reliability layer. */
export function ResearchDiagram() {
  const c = "var(--cat-ml)";
  const xs = [20, 172, 324, 476];
  const bw = 132;
  return (
    <svg
      viewBox="0 0 628 270"
      role="img"
      aria-label="Thesis pipeline: a medical question is embedded with MiniLM, FAISS retrieves passages, Mistral 7B generates a grounded answer, then RAGAS metrics and calibration produce a composite reliability score."
      className="block w-full"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      <rect width="628" height="270" rx="16" style={{ fill: tint(c, 6) }} stroke="var(--line)" />
      <text x="20" y="34" fontSize="13" fill="var(--muted)">
        Grounded answering, all local, no GPU
      </text>
      <Box x={xs[0]} y={50} w={bw} h={62} title="Question" sub="MedQuAD" c={c} />
      <Box x={xs[1]} y={50} w={bw} h={62} title="Embed" sub="all-MiniLM-L6-v2" c={c} />
      <Box x={xs[2]} y={50} w={bw} h={62} title="Retrieve" sub="FAISS, top-k" c={c} />
      <Box x={xs[3]} y={50} w={bw} h={62} title="Generate" sub="Mistral 7B, Ollama" c={c} />
      {[0, 1, 2].map((i) => (
        <Arrow key={i} x1={xs[i] + bw} y1={81} x2={xs[i + 1]} y2={81} />
      ))}
      <Arrow x1={xs[3] + bw / 2} y1={112} x2={xs[3] + bw / 2} y2={162} color={c} />
      <text x="20" y="150" fontSize="13" fill="var(--muted)">
        Reliability layer (thesis contribution)
      </text>
      <Box x={xs[3]} y={162} w={bw} h={62} title="RAGAS" sub="evaluation metrics" c={c} />
      <Box x={xs[2] - 10} y={162} w={bw + 10} h={62} title="Calibration" sub="Platt, temperature" c={c} />
      <Box x={xs[1] - 20} y={162} w={bw + 20} h={62} title="Conformal" sub="prediction" c={c} />
      <Box x={xs[0]} y={162} w={bw - 24} h={62} title="Score" sub="composite" c={c} strong />
      <Arrow x1={xs[3]} y1={193} x2={xs[2] + bw} y2={193} />
      <Arrow x1={xs[2] - 10} y1={193} x2={xs[1] - 20 + bw + 20} y2={193} />
      <Arrow x1={xs[1] - 20} y1={193} x2={xs[0] + bw - 24} y2={193} />
      <text x="20" y="252" fontSize="12" fill="var(--muted)">
        Reported with its limits: query–document leakage, no clinical validation, manually set weights.
      </text>
    </svg>
  );
}
