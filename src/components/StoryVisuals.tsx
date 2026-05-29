"use client";

/**
 * Per-beat themed visuals for the pinned story section.
 *
 * Each beat gets a different visual metaphor:
 *   01 IDEA          → a central spark with a mind-map of orbiting nodes
 *   02 INTELLIGENCE  → a perspective-tilted neural-net mesh
 *   03 VELOCITY      → a curved trajectory with a travelling rocket dot
 *                      plus a small "deploys / TTV / velocity" stat block
 *
 * Each visual fades with the beat (it lives inside the .beat element, so
 * GSAP's beat-level opacity animation transports the visual too).
 * All motion is CSS @keyframes / SVG animateMotion — cheap and pauses
 * automatically when the section is offscreen.
 */

export type BeatVisual = "idea" | "intel" | "vel";

export function StoryVisual({ kind }: { kind: BeatVisual }) {
  switch (kind) {
    case "idea":  return <IdeaVisual />;
    case "intel": return <IntelVisual />;
    case "vel":   return <VelVisual />;
  }
}

/* ───────────────────────── 01 IDEA — spark mind-map ──────────────────── */

const IDEA_NODES: { x: number; y: number; r: number; label: string }[] = [
  { x: 36,  y: 60,  r: 7,  label: "brief" },
  { x: 250, y: 38,  r: 9,  label: "spark" },
  { x: 282, y: 188, r: 6,  label: "sketch" },
  { x: 60,  y: 252, r: 8,  label: "model" },
  { x: 190, y: 270, r: 6,  label: "system" },
];

function IdeaVisual() {
  return (
    <div className="sv sv-idea">
      <svg className="sv-idea__svg" viewBox="0 0 320 320" aria-hidden="true">
        <defs>
          <radialGradient id="sv-idea-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="40%" stopColor="#E6FF00" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#E6FF00" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* outer rotating dashed orbit */}
        <circle cx="160" cy="160" r="130" className="sv-idea__orbit" />
        <circle cx="160" cy="160" r="92"  className="sv-idea__orbit sv-idea__orbit--inner" />

        {/* connections core → nodes */}
        {IDEA_NODES.map((n, i) => (
          <line
            key={`l${i}`}
            x1="160" y1="160" x2={n.x} y2={n.y}
            className="sv-idea__link"
            style={{ animationDelay: `${i * 0.25}s` }}
          />
        ))}

        {/* nodes */}
        {IDEA_NODES.map((n, i) => (
          <g key={`n${i}`} className="sv-idea__node" style={{ animationDelay: `${i * 0.4}s` }}>
            <circle cx={n.x} cy={n.y} r={n.r + 5} className="sv-idea__node-halo" />
            <circle cx={n.x} cy={n.y} r={n.r}     className="sv-idea__node-core" />
          </g>
        ))}

        {/* central spark + pulse rings */}
        <circle cx="160" cy="160" r="30" className="sv-idea__pulse" />
        <circle cx="160" cy="160" r="30" className="sv-idea__pulse" style={{ animationDelay: "1s" }} />
        <circle cx="160" cy="160" r="30" className="sv-idea__pulse" style={{ animationDelay: "2s" }} />
        <circle cx="160" cy="160" r="18" fill="url(#sv-idea-core)" className="sv-idea__core" />

        {/* spark rays */}
        {Array.from({ length: 8 }).map((_, i) => (
          <line
            key={`r${i}`}
            x1="160" y1="160" x2="160" y2="120"
            className="sv-idea__ray"
            transform={`rotate(${i * 45} 160 160)`}
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </svg>

      {/* floating labels overlaid on the nodes */}
      {IDEA_NODES.map((n, i) => (
        <span
          key={`lbl${i}`}
          className="sv-idea__label"
          style={{
            top:  `${(n.y / 320) * 100}%`,
            left: `${(n.x / 320) * 100}%`,
            animationDelay: `${i * 0.4}s`,
          }}
        >
          {n.label}
        </span>
      ))}
    </div>
  );
}

/* ─────────────────── 02 INTELLIGENCE — neural-net mesh ──────────────── */

const INTEL_LAYERS: { x: number; ys: number[] }[] = [
  { x: 30,  ys: [60, 120, 180, 240] },
  { x: 110, ys: [40, 100, 160, 220, 280] },
  { x: 210, ys: [60, 120, 180, 240] },
  { x: 290, ys: [110, 210] },
];

function IntelVisual() {
  // pre-compute the line list so React renders deterministically (no Math.random for SSR)
  const links: { k: string; x1: number; y1: number; x2: number; y2: number; delay: number }[] = [];
  for (let li = 0; li < INTEL_LAYERS.length - 1; li++) {
    const A = INTEL_LAYERS[li];
    const B = INTEL_LAYERS[li + 1];
    A.ys.forEach((y1, i) => {
      B.ys.forEach((y2, j) => {
        links.push({
          k: `${li}-${i}-${j}`,
          x1: A.x, y1, x2: B.x, y2,
          delay: ((li * 0.5 + i * 0.18 + j * 0.07) % 2.4),
        });
      });
    });
  }

  return (
    <div className="sv sv-intel">
      <svg className="sv-intel__svg" viewBox="0 0 320 320" aria-hidden="true">
        {/* perspective grid backdrop */}
        <g className="sv-intel__grid">
          {Array.from({ length: 5 }).map((_, i) => (
            <line key={`gh${i}`} x1="0" y1={60 + i * 50} x2="320" y2={60 + i * 50} />
          ))}
          {Array.from({ length: 7 }).map((_, i) => (
            <line key={`gv${i}`} x1={30 + i * 45} y1="40" x2={30 + i * 45} y2="280" />
          ))}
        </g>

        {/* synaptic links */}
        {links.map((l) => (
          <line
            key={l.k}
            x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
            className="sv-intel__link"
            style={{ animationDelay: `${l.delay}s` }}
          />
        ))}

        {/* nodes */}
        {INTEL_LAYERS.flatMap((L, li) =>
          L.ys.map((y, i) => (
            <g key={`n${li}-${i}`} className="sv-intel__node" style={{ animationDelay: `${(li * 0.3 + i * 0.18) % 2.1}s` }}>
              <circle cx={L.x} cy={y} r="8" className="sv-intel__node-halo" />
              <circle cx={L.x} cy={y} r="4" className="sv-intel__node-core" />
            </g>
          ))
        )}

        {/* synaptic beads travelling across the deepest layer */}
        {INTEL_LAYERS.slice(0, -1).map((L, li) => {
          const y1 = L.ys[Math.floor(L.ys.length / 2)];
          const N = INTEL_LAYERS[li + 1];
          const y2 = N.ys[Math.floor(N.ys.length / 2)];
          const path = `M${L.x},${y1} L${N.x},${y2}`;
          return (
            <circle key={`b${li}`} r="3" className="sv-intel__bead">
              <animateMotion dur="1.6s" begin={`${li * 0.4}s`} repeatCount="indefinite" path={path} />
            </circle>
          );
        })}
      </svg>

      <span className="sv-intel__tag">MODEL · v0.42</span>
      <span className="sv-intel__layer-tag sv-intel__layer-tag--in">INPUT</span>
      <span className="sv-intel__layer-tag sv-intel__layer-tag--out">OUTPUT</span>
    </div>
  );
}

/* ───────────────────────── 03 VELOCITY — trajectory ─────────────────── */

const VEL_PATH = "M20,260 Q90,180 160,140 T300,30";

function VelVisual() {
  return (
    <div className="sv sv-vel">
      {/* streaking motion lines */}
      <div className="sv-vel__streaks" aria-hidden="true">
        {Array.from({ length: 14 }).map((_, i) => (
          <i
            key={i}
            style={{
              top: `${(i * 7.5 + 6) % 92}%`,
              ["--w" as string]: `${28 + ((i * 13) % 60)}%`,
              animationDelay: `${(i * 0.18) % 2.4}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* trajectory + travelling rocket */}
      <svg className="sv-vel__svg" viewBox="0 0 320 320" aria-hidden="true">
        <path d={VEL_PATH} className="sv-vel__trail" />
        <path d={VEL_PATH} className="sv-vel__path" />

        <g className="sv-vel__rocket">
          <polygon points="0,-5 14,0 0,5 4,0" />
          <animateMotion dur="4.4s" repeatCount="indefinite" path={VEL_PATH} rotate="auto" />
        </g>

        {/* checkpoint dots along the curve */}
        <circle cx="20"  cy="260" r="4" className="sv-vel__pt" />
        <circle cx="160" cy="140" r="4" className="sv-vel__pt" />
        <circle cx="300" cy="30"  r="6" className="sv-vel__pt sv-vel__pt--end" />
      </svg>

      {/* stat block */}
      <div className="sv-vel__stats" aria-hidden="true">
        <div>
          <em>deploys</em>
          <b>247<i>/wk</i></b>
        </div>
        <div>
          <em>ttv</em>
          <b>3.2<i>d</i></b>
        </div>
        <div>
          <em>velocity</em>
          <b><i>↑</i> 18<i>%</i></b>
        </div>
      </div>
    </div>
  );
}
