/** @type {import('tailwindcss').Config} */
// Themed via CSS variables (see src/index.css, :root + [data-theme] blocks).
// Four reader modes live on <html data-theme="..."> — light (default), dark,
// sepia, night. Every class below stays identical across modes; the channel
// triples swap. rgb(var(...) / <alpha-value>) keeps opacity modifiers
// (bg-canvas/85, border-green/30, bg-charcoal/95, ...) working.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          // bare `ink` keeps its historical near-black text role (now paper)
          DEFAULT: 'rgb(var(--c-paper) / <alpha-value>)',
          950: 'rgb(var(--c-ink-950) / <alpha-value>)',
          900: 'rgb(var(--c-ink-900) / <alpha-value>)',
          800: 'rgb(var(--c-ink-800) / <alpha-value>)',
          700: 'rgb(var(--c-ink-700) / <alpha-value>)',
          600: 'rgb(var(--c-ink-600) / <alpha-value>)',
          500: 'rgb(var(--c-ink-500) / <alpha-value>)',
          400: 'rgb(var(--c-ink-400) / <alpha-value>)',
        },
        // canvas (page background)
        canvas: 'rgb(var(--c-canvas) / <alpha-value>)',
        // subtle alt surface
        mist: 'rgb(var(--c-mist) / <alpha-value>)',
        // dark sections (footer, contact band, media chips/scrims)
        charcoal: 'rgb(var(--c-charcoal) / <alpha-value>)',
        // warm light type on dark; paper = primary text on the page surface
        snow: 'rgb(var(--c-snow) / <alpha-value>)',
        // logo-plate surface (brand tiles / marquee chips — keeps marks legible)
        plate: 'rgb(var(--c-plate) / <alpha-value>)',
        paper: 'rgb(var(--c-paper) / <alpha-value>)',
        muted: 'rgb(var(--c-muted) / <alpha-value>)',
        // the one accent family (class names kept across re-themes)
        green: {
          DEFAULT: 'rgb(var(--c-green) / <alpha-value>)',
          bright: 'rgb(var(--c-green-bright) / <alpha-value>)',
          deep: 'rgb(var(--c-green-deep) / <alpha-value>)',
        },
        // flat aliases used as `text-greenBright` / `text-greenDeep`
        greenBright: 'rgb(var(--c-green-bright) / <alpha-value>)',
        greenDeep: 'rgb(var(--c-green-deep) / <alpha-value>)',
        // readable accent TEXT on light surfaces (AA)
        greenReadable: 'rgb(var(--c-green-readable) / <alpha-value>)',
        // accent on DARK sections — stays legible on charcoal
        skyBlue: 'rgb(var(--c-sky) / <alpha-value>)',
        // type colour ON a filled accent chip/button (flips per mode)
        onAccent: 'rgb(var(--c-on-accent) / <alpha-value>)',
        // legacy slots
        neonBlue: 'rgb(var(--c-neon) / <alpha-value>)',
        violet: 'rgb(var(--c-violet) / <alpha-value>)',
        slateAccent: 'rgb(var(--c-slate) / <alpha-value>)',
        acid: 'rgb(var(--c-acid) / <alpha-value>)',
      },
      fontFamily: {
        // Anton = ultra-condensed grotesque, the title-card face
        display: ['Anton', 'Archivo', 'system-ui', 'sans-serif'],
        body: ['"Instrument Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      letterSpacing: {
        wideish: '0.08em',
      },
      keyframes: {
        dash: {
          to: { strokeDashoffset: '-240' },
        },
        // smooth cinematic rise (was stepped glitch — removed on request)
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(26px)', filter: 'blur(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)', filter: 'blur(0)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        // gentle drift (was erratic jitter)
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(0.4deg)' },
        },
        scan: {
          '0%': { top: '-15%' },
          '100%': { top: '115%' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1', r: '3.5' },
          '50%': { opacity: '0.5', r: '4.2' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        dash: 'dash 9s linear infinite',
        fadeUp: 'fadeUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) both',
        blink: 'blink 1.1s step-end infinite',
        float: 'float 7s ease-in-out infinite',
        scan: 'scan 9s linear infinite',
        pulseSoft: 'pulseSoft 2.6s ease-in-out infinite',
        fadeIn: 'fadeIn 0.45s ease both',
      },
    },
  },
  plugins: [],
}
