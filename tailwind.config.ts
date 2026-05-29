import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
  theme: {
    extend: {
      colors: {
        void: "#050505",
        "void-2": "#0b0b0c",
        ink: "#F4F4F5",
        "ink-dim": "#8a8a90",
        "ink-faint": "#3a3a40",
        acid: "#E6FF00",
        pink: "#FF007F",
        violet: "#7C3AED",
        teal: "#00E0B8",
        green: "#39FF88",
      },
      fontFamily: {
        display: ['"Clash Display"', '"Syne"', "system-ui", "sans-serif"],
        body: ['"Satoshi"', '"Inter"', "system-ui", "sans-serif"],
        mono: ['"Space Mono"', "ui-monospace", "monospace"],
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(.16,1,.3,1)",
      },
    },
  },
  plugins: [],
};

export default config;
