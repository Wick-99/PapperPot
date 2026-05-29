"use client";

/**
 * Per-category "rich content" mockups that sit inside .cat__visual.
 * Every mockup is themed to the category, uses the panel's --accent token,
 * and is animated with CSS keyframes (cheap, no per-frame JS, pauses
 * automatically when the section is offscreen via composite layers).
 *
 * Each visual is a self-contained mini-design — browser, phone, pipeline,
 * code editor, agent mesh, live metrics, training curve. Sizing is driven
 * by the .cat__visual container's clamp() values in globals.css.
 */

export type VisualKind = "web" | "mobile" | "auto" | "aiauto" | "agent" | "mlops" | "train";

export function CategoryVisual({ kind }: { kind: VisualKind }) {
  switch (kind) {
    case "web":    return <BrowserVisual />;
    case "mobile": return <PhoneVisual />;
    case "auto":   return <PipelineVisual />;
    case "aiauto": return <CodeVisual />;
    case "agent":  return <AgentVisual />;
    case "mlops":  return <MetricsVisual />;
    case "train":  return <TrainVisual />;
  }
}

/* ───────────────────────────── shared chrome ───────────────────────────── */

function WindowChrome({ url }: { url: string }) {
  return (
    <div className="cv-chrome">
      <div className="cv-chrome__dots"><i /><i /><i /></div>
      <span className="cv-chrome__url">{url}</span>
    </div>
  );
}

/* ───────────────────────────── 01 Websites ─────────────────────────────── */

function BrowserVisual() {
  return (
    <div className="cv cv-browser">
      <WindowChrome url="papperpot.studio" />
      <div className="cv-browser__body">
        <div className="cv-browser__hero" />
        <div className="cv-browser__row" />
        <div className="cv-browser__row cv-browser__row--mid" />
        <div className="cv-browser__row cv-browser__row--short" />
        <div className="cv-browser__grid">
          <div />
          <div />
          <div />
        </div>
      </div>
      <span className="cv-browser__cursor" />
    </div>
  );
}

/* ───────────────────────────── 02 Mobile ───────────────────────────────── */

function PhoneVisual() {
  return (
    <div className="cv cv-phone">
      <div className="cv-phone__bezel">
        <span className="cv-phone__notch" />
        <div className="cv-phone__screen">
          <div className="cv-phone__status">
            <span>9:41</span>
            <span className="cv-phone__signal" />
          </div>
          <div className="cv-phone__title" />
          <div className="cv-phone__sub" />
          <div className="cv-phone__cards">
            <div className="cv-phone__card" />
            <div className="cv-phone__card" />
            <div className="cv-phone__card" />
          </div>
          <div className="cv-phone__nav">
            <i /><i /><i /><i />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────── 03 Automations ──────────────────────────── */

function PipelineVisual() {
  const NODES: { x: number; y: number; tag: string }[] = [
    { x: 32,  y: 50,  tag: "TRIG" },
    { x: 108, y: 32,  tag: "FETCH" },
    { x: 172, y: 78,  tag: "MAP" },
    { x: 140, y: 152, tag: "POST" },
    { x: 52,  y: 162, tag: "LOG" },
  ];
  const PATH = "M32,50 L108,32 L172,78 L140,152 L52,162";

  return (
    <svg className="cv cv-pipeline" viewBox="0 0 220 200" aria-hidden="true">
      <defs>
        <linearGradient id="cv-pipe-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"  stopColor="var(--accent)" stopOpacity="0.95" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      <path d={PATH} className="cv-pipeline__shadow" />
      <path d={PATH} className="cv-pipeline__path" />
      {/* Bead travelling along the path — SVG animateMotion is GPU-cheap. */}
      <circle r="4" className="cv-pipeline__bead">
        <animateMotion dur="5s" repeatCount="indefinite" path={PATH} rotate="auto" />
      </circle>
      {NODES.map((n, i) => (
        <g key={n.tag} className="cv-pipeline__node" style={{ animationDelay: `${i * 0.35}s` }}>
          <circle cx={n.x} cy={n.y} r="13" className="cv-pipeline__halo" />
          <circle cx={n.x} cy={n.y} r="6"  className="cv-pipeline__dot" />
          <text x={n.x + 18} y={n.y + 4} className="cv-pipeline__tag">{n.tag}</text>
        </g>
      ))}
    </svg>
  );
}

/* ───────────────────────────── 04 AI Automations ───────────────────────── */

function CodeVisual() {
  // Plain rendering with CSS-animated blinking caret + scan line.
  // Keeping it static avoids state churn during scroll; the motion comes
  // from a single CSS keyframe.
  return (
    <div className="cv cv-code">
      <WindowChrome url="flow.py" />
      <pre className="cv-code__body">
        <code>
          <span className="cv-code__ln"><i>01</i><em>from</em> papperpot <em>import</em> <strong>agent</strong></span>
          <span className="cv-code__ln"><i>02</i></span>
          <span className="cv-code__ln"><i>03</i><em>def</em> <strong>triage</strong>(ticket):</span>
          <span className="cv-code__ln"><i>04</i>{"  "}ctx = <strong>retrieve</strong>(ticket)</span>
          <span className="cv-code__ln"><i>05</i>{"  "}plan = agent.<strong>plan</strong>(ctx)</span>
          <span className="cv-code__ln"><i>06</i>{"  "}<em>return</em> plan.<strong>run</strong>()<span className="cv-code__caret" /></span>
        </code>
      </pre>
      <span className="cv-code__scan" />
    </div>
  );
}

/* ───────────────────────────── 05 Agentic ──────────────────────────────── */

function AgentVisual() {
  const SATS = [
    { x: 100, y: 28,  label: "PLAN" },
    { x: 174, y: 102, label: "TOOL" },
    { x: 100, y: 172, label: "EVAL" },
    { x: 26,  y: 102, label: "MEM"  },
  ];
  return (
    <svg className="cv cv-agent" viewBox="0 0 200 200" aria-hidden="true">
      {/* expanding pulse rings */}
      <circle cx="100" cy="100" r="34" className="cv-agent__pulse" />
      <circle cx="100" cy="100" r="34" className="cv-agent__pulse" style={{ animationDelay: "0.9s" }} />
      <circle cx="100" cy="100" r="34" className="cv-agent__pulse" style={{ animationDelay: "1.8s" }} />

      {/* orbit ring */}
      <circle cx="100" cy="100" r="74" className="cv-agent__orbit" />

      {/* links + travelling message beads */}
      {SATS.map((s, i) => {
        const linkPath = `M100,100 L${s.x},${s.y}`;
        return (
          <g key={s.label}>
            <line x1="100" y1="100" x2={s.x} y2={s.y} className="cv-agent__link" style={{ animationDelay: `${i * 0.4}s` }} />
            <circle r="2.5" className="cv-agent__msg">
              <animateMotion dur="2.2s" begin={`${i * 0.55}s`} repeatCount="indefinite" path={linkPath} />
            </circle>
          </g>
        );
      })}

      {/* satellites */}
      {SATS.map((s, i) => (
        <g key={s.label + "-sat"} className="cv-agent__sat" style={{ animationDelay: `${i * 0.3}s` }}>
          <circle cx={s.x} cy={s.y} r="10" className="cv-agent__sat-halo" />
          <circle cx={s.x} cy={s.y} r="5"  className="cv-agent__sat-core" />
          <text x={s.x} y={s.y - 16} className="cv-agent__sat-label" textAnchor="middle">{s.label}</text>
        </g>
      ))}

      {/* core */}
      <circle cx="100" cy="100" r="18" className="cv-agent__core" />
      <circle cx="100" cy="100" r="11" className="cv-agent__core cv-agent__core--in" />
    </svg>
  );
}

/* ───────────────────────────── 06 MLOps ────────────────────────────────── */

// Pre-baked bar heights — Math.random in render breaks SSR hydration.
const BARS = [38, 62, 48, 76, 55, 84, 68, 92, 73, 86, 78, 95, 80, 90, 82, 88];

function MetricsVisual() {
  return (
    <div className="cv cv-metrics">
      <WindowChrome url="atlas/health" />
      <div className="cv-metrics__stats">
        <div className="cv-metrics__stat">
          <b>12.4<span>ms</span></b>
          <em>p95 latency</em>
        </div>
        <div className="cv-metrics__stat">
          <b>99.8<span>%</span></b>
          <em>uptime · 30d</em>
        </div>
      </div>
      <div className="cv-metrics__bars">
        {BARS.map((h, i) => (
          <i
            key={i}
            style={{
              ["--h" as string]: `${h}%`,
              animationDelay: `${i * 0.07}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>
      <svg className="cv-metrics__spark" viewBox="0 0 200 40" preserveAspectRatio="none" aria-hidden="true">
        <polyline
          className="cv-metrics__spark-line"
          points="0,30 18,22 36,26 54,14 72,20 90,10 108,16 126,6 144,12 162,4 180,9 200,3"
        />
      </svg>
    </div>
  );
}

/* ───────────────────────────── 07 Model Training ───────────────────────── */

function TrainVisual() {
  const LAYERS = [3, 5, 4, 2];
  return (
    <div className="cv cv-train">
      <div className="cv-train__head">
        <span>EPOCH <b>23</b>/100</span>
        <span>LOSS <b>0.412</b></span>
      </div>
      <svg className="cv-train__chart" viewBox="0 0 200 100" preserveAspectRatio="none" aria-hidden="true">
        <path className="cv-train__grid" d="M0,25 L200,25 M0,50 L200,50 M0,75 L200,75" />
        <path
          className="cv-train__curve cv-train__curve--val"
          d="M0,90 C30,85 45,75 60,68 C80,62 100,55 120,52 C140,49 160,46 200,42"
        />
        <path
          className="cv-train__curve"
          d="M0,85 C30,80 45,65 60,55 C80,45 100,30 120,25 C140,22 160,15 200,10"
        />
      </svg>
      <div className="cv-train__net" aria-hidden="true">
        {LAYERS.map((n, li) => (
          <div className="cv-train__layer" key={li}>
            {Array.from({ length: n }).map((_, ni) => (
              <i
                key={ni}
                style={{
                  animationDelay: `${(li * 0.25 + ni * 0.15) % 2.4}s`,
                } as React.CSSProperties}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
