/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Lane: Vercel-after-midnight. Neutrals tinted toward the signal-red hue
        // (chroma ~0.005-0.012 in OKLCH) so the page doesn't read as default
        // dark-mode template. No #000, no #fff anywhere.
        ink: '#0c0a09',          // page background — near-black, warm-tinted
        slate: '#141211',        // surface / scrolled nav
        graphite: '#1c1917',     // card body
        wire: '#2a2522',         // hairline borders, dividers
        paper: '#f5f1ea',        // emphasis text — warm off-white
        ash: '#a09690',          // body copy — warm muted neutral
        signal: '#ff3b1f',       // THE accent. Single saturated color.
        'signal-deep': '#c92a10',// hover state
        moss: '#2f9e44',         // available-for-work dot — only non-signal hue
        // legacy aliases kept so existing utility classes still resolve.
        // Mapped to the new ramp; "primary" is now signal red.
        background: '#0c0a09',
        surface: '#141211',
        card: '#1c1917',
        primary: '#ff3b1f',
        accent: '#ff3b1f',
        muted: '#a09690',
      },
      fontFamily: {
        // Single-family system. `display` = mono ExtraBold; `body` = mono Regular.
        // The weight contrast IS the typographic voice.
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        display: ['var(--font-mono)', 'ui-monospace', 'monospace'],
        body: ['var(--font-mono)', 'ui-monospace', 'monospace'],
        rubik: ['var(--font-rubik)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.05em',
        tighter: '-0.04em',
        flat: '0',
        wide: '0.04em',
        widest: '0.18em', // for ALL-CAPS short labels only
      },
      borderRadius: {
        // Hard, rectilinear. No pills. No soft cards.
        none: '0',
        sm: '2px',
        DEFAULT: '2px',
        md: '2px',
        lg: '2px',
        xl: '2px',
        '2xl': '2px',
        '3xl': '4px',
        full: '9999px', // kept ONLY for the available-for-work dot
      },
      animation: {
        'pulse-soft': 'pulse-soft 4s ease-in-out infinite',
      },
      keyframes: {
        'pulse-soft': {
          '0%, 100%': { opacity: 0.55 },
          '50%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
