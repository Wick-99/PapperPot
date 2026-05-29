"use client";

/**
 * Per-project rich media used inside each showcase window.
 *
 * Every kind is a tight, themed mock-up of the actual product the case
 * study is about — Helios's agent console, Nori's health rings, Vantage's
 * immersive site, Loom's automation pipeline, Atlas's MLOps dashboard.
 * All motion is CSS @keyframes (cheap, no JS ticking).
 */

export type ProjectKind = "helios" | "nori" | "vantage" | "loom" | "atlas";

export function ShowcaseMedia({ kind }: { kind: ProjectKind }) {
  switch (kind) {
    case "helios":  return <HeliosMedia />;
    case "nori":    return <NoriMedia />;
    case "vantage": return <VantageMedia />;
    case "loom":    return <LoomMedia />;
    case "atlas":   return <AtlasMedia />;
  }
}

/* ─── Helios OS — agentic ops console ─────────────────────────── */

const HELIOS_LOG = [
  { agent: "scout-01", action: "indexed 412 docs",     w: 70 },
  { agent: "plan-04",  action: "drafted execution",    w: 60 },
  { agent: "tool-02",  action: "called stripe.refund", w: 80 },
  { agent: "eval-01",  action: "scored 0.93",          w: 50 },
];

function HeliosMedia() {
  return (
    <div className="sm sm-helios">
      <div className="sm-helios__top">
        <span className="sm-helios__pill sm-helios__pill--live">
          <i /> LIVE
        </span>
        <span className="sm-helios__pill">helios · v2.4.1</span>
      </div>
      <div className="sm-helios__rows">
        {HELIOS_LOG.map((r, i) => (
          <div
            className="sm-helios__row"
            key={i}
            style={{ animationDelay: `${i * 0.4}s` }}
          >
            <i />
            <b>{r.agent}</b>
            <em>{r.action}</em>
            <span style={{ width: `${r.w}%` }} />
          </div>
        ))}
      </div>
      <div className="sm-helios__stats">
        <div><b>847</b><em>agents</em></div>
        <div><b>12k</b><em>tasks/d</em></div>
        <div><b>99.4<i>%</i></b><em>success</em></div>
      </div>
    </div>
  );
}

/* ─── Nori — mobile health companion ──────────────────────────── */

function NoriMedia() {
  // SVG arc-length tricks for the activity ring
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <div className="sm sm-nori">
      <div className="sm-nori__phone">
        <span className="sm-nori__notch" />
        <div className="sm-nori__screen">
          <div className="sm-nori__head">
            <span>good morning</span>
            <b>Sasha</b>
          </div>
          <div className="sm-nori__rings">
            <svg viewBox="0 0 80 80">
              <circle cx="40" cy="40" r={r} className="sm-nori__ring sm-nori__ring--track" />
              <circle
                cx="40" cy="40" r={r}
                className="sm-nori__ring sm-nori__ring--fill sm-nori__ring--move"
                strokeDasharray={`${c}`}
                strokeDashoffset={c * 0.28}
              />
              <circle cx="40" cy="40" r={r - 7} className="sm-nori__ring sm-nori__ring--track" />
              <circle
                cx="40" cy="40" r={r - 7}
                className="sm-nori__ring sm-nori__ring--fill sm-nori__ring--rest"
                strokeDasharray={`${2 * Math.PI * (r - 7)}`}
                strokeDashoffset={2 * Math.PI * (r - 7) * 0.55}
              />
            </svg>
            <div className="sm-nori__bpm">
              <b>72</b><span>bpm</span>
            </div>
          </div>
          <div className="sm-nori__kpis">
            <div><b>8.2<i>k</i></b><em>steps</em></div>
            <div><b>92</b><em>hrv</em></div>
            <div><b>7.6<i>h</i></b><em>sleep</em></div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Vantage — immersive WebGL launch site ───────────────────── */

function VantageMedia() {
  return (
    <div className="sm sm-vantage">
      <div className="sm-vantage__sky" />
      <div className="sm-vantage__noise" />
      <div className="sm-vantage__rays">
        <i /><i /><i /><i />
      </div>
      <div className="sm-vantage__head">
        <span>VANTAGE</span>
        <i>vantage.studio</i>
      </div>
      <div className="sm-vantage__title">
        <b>POINT</b>
        <b>OF</b>
        <b>SEEING</b>
      </div>
      <div className="sm-vantage__foot">
        <span>SCROLL</span>
        <em>↓</em>
      </div>
    </div>
  );
}

/* ─── Loom — revenue automation pipeline ──────────────────────── */

function LoomMedia() {
  const NODES = [
    { x: 36,  y: 50,  tag: "lead" },
    { x: 110, y: 30,  tag: "score" },
    { x: 184, y: 60,  tag: "route" },
    { x: 260, y: 40,  tag: "post"  },
    { x: 110, y: 110, tag: "log"   },
  ];
  const path = "M36,50 L110,30 L184,60 L260,40 M110,30 L110,110";

  return (
    <div className="sm sm-loom">
      <div className="sm-loom__head">
        <div>
          <span>MRR · this run</span>
          <b>$42,180<i> ↑</i></b>
        </div>
        <div>
          <span>throughput</span>
          <b>1,204<i>/h</i></b>
        </div>
      </div>
      <svg className="sm-loom__pipe" viewBox="0 0 300 140">
        <path d={path} className="sm-loom__line" />
        <circle r="3.2" className="sm-loom__bead">
          <animateMotion dur="3.4s" repeatCount="indefinite" path={path} rotate="auto" />
        </circle>
        <circle r="3.2" className="sm-loom__bead sm-loom__bead--alt">
          <animateMotion dur="3.4s" begin="1.7s" repeatCount="indefinite" path={path} rotate="auto" />
        </circle>
        {NODES.map((n) => (
          <g key={n.tag}>
            <circle cx={n.x} cy={n.y} r="10" className="sm-loom__halo" />
            <circle cx={n.x} cy={n.y} r="5"  className="sm-loom__node" />
            <text x={n.x} y={n.y + 22} className="sm-loom__tag" textAnchor="middle">{n.tag}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ─── Atlas — MLOps model platform ────────────────────────────── */

const ATLAS_SPARK = [40, 32, 38, 22, 30, 14, 22, 8, 16, 4, 11, 3];
const ATLAS_BARS  = [48, 62, 50, 76, 60, 88, 70, 92, 75, 90, 80];

function AtlasMedia() {
  const sparkPoints = ATLAS_SPARK.map((v, i) => `${(i / (ATLAS_SPARK.length - 1)) * 200},${v}`).join(" ");
  return (
    <div className="sm sm-atlas">
      <div className="sm-atlas__head">
        <span className="sm-atlas__live"><i /> all healthy</span>
        <span className="sm-atlas__cluster">cluster · us-east-1</span>
      </div>
      <div className="sm-atlas__kpis">
        <div>
          <em>p95</em>
          <b>12.4<i>ms</i></b>
        </div>
        <div>
          <em>throughput</em>
          <b>1.2<i>M/h</i></b>
        </div>
        <div>
          <em>drift</em>
          <b>0.02<i>σ</i></b>
        </div>
      </div>
      <div className="sm-atlas__plots">
        <svg viewBox="0 0 200 44" preserveAspectRatio="none" className="sm-atlas__spark">
          <polyline points={sparkPoints} className="sm-atlas__spark-line" />
        </svg>
        <div className="sm-atlas__bars">
          {ATLAS_BARS.map((h, i) => (
            <i key={i} style={{ ["--h" as string]: `${h}%`, animationDelay: `${i * 0.07}s` } as React.CSSProperties} />
          ))}
        </div>
      </div>
    </div>
  );
}
