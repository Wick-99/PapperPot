"use client";

import type { Service } from "@/data/services";

/**
 * Two complementary panels: "Perfect For" (audience) and an "Examples"
 * grid showing the kinds of things this service can build. The examples
 * grid is intentionally tile-like — hover lifts each tile and the accent
 * border lights up. Tiles never link; this is browse-style content.
 */
export function ServiceExamples({ service }: { service: Service }) {
  return (
    <section
      className="srv-examples"
      style={{ ["--accent" as string]: service.accent } as React.CSSProperties}
    >
      <div className="srv-examples__col srv-examples__col--for">
        <span className="srv-examples__idx">◢ {service.perfectForLabel.toUpperCase()}</span>
        <h2 className="srv-examples__h">
          Built for the
          <br />
          <em>shipping crowd.</em>
        </h2>
        <ul className="srv-examples__pills">
          {service.perfectFor.map((item) => (
            <li key={item} className="srv-examples__pill">{item}</li>
          ))}
        </ul>
      </div>

      <div className="srv-examples__col srv-examples__col--ex">
        <span className="srv-examples__idx">◢ {service.examplesLabel.toUpperCase()}</span>
        <ul className="srv-examples__tiles">
          {service.examples.map((item, i) => (
            <li
              key={item}
              className="srv-examples__tile"
              style={{ animationDelay: `${i * 0.08}s` } as React.CSSProperties}
            >
              <span className="srv-examples__tile-num">
                {String(i + 1).padStart(2, "0")}
              </span>
              <b>{item}</b>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
