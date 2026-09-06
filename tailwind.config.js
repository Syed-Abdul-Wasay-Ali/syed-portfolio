/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // deep-space indigo inks — surfaces, hairlines, structural blocks
        ink: {
          DEFAULT: '#0B0A1E',
          950: '#070614',
          900: '#100F26',
          800: '#171633',
          700: '#1F1E41',
          600: '#282659',
          500: '#333168',
        },
        // canvas (deep indigo page)
        canvas: '#0B0A1E',
        mist: '#131228',
        // cool white text on dark
        snow: '#F2F1FC',
        paper: '#F5F4FF',
        muted: '#9A98CF',
        // neon magenta accent — “green” slot keeps class names working
        green: {
          DEFAULT: '#FF36C8',
          bright: '#FF7DE0',
          deep: '#7A0F5C',
        },
        // flat aliases used as `text-greenBright` / `text-greenDeep`
        greenBright: '#FF7DE0',
        greenDeep: '#7A0F5C',
        // neon blue — glow accents, hover states, node links
        neonBlue: '#00B2FF',
        // violet — purple metadata text
        violet: '#A78BFA',
        // electric cyan metadata / secondary accent
        slateAccent: '#A78BFA',
        // acid yellow pop (scanline hot line etc.)
        acid: '#FFE45C',
        neonBlue: '#00B2FF',
        violet: '#A78BFA',
      },
      fontFamily: {
        display: ['Archivo', 'system-ui', 'sans-serif'],
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
        // glitchy entry: stepped, with skew jumps instead of a smooth slide
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(10px) skewX(-4deg)' },
          '60%': { opacity: '0.9', transform: 'translateY(-1px) skewX(2deg)' },
          '100%': { opacity: '1', transform: 'translateY(0) skewX(0deg)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        // erratic hover-jitter float (Spider-Verse style)
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '30%': { transform: 'translateY(-7px) rotate(0.8deg)' },
          '55%': { transform: 'translateY(-2px) rotate(-0.6deg)' },
          '75%': { transform: 'translateY(-10px) rotate(0.4deg)' },
        },
        scan: {
          '0%': { top: '-15%' },
          '100%': { top: '115%' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1', r: '3.5' },
          '50%': { opacity: '0.45', r: '4.5' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '70%': { opacity: '0.9' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        // steps() everywhere = frame-by-frame pixel jumps, no smooth easing
        dash: 'dash 9s steps(24) infinite',
        fadeUp: 'fadeUp 0.7s steps(5) both',
        blink: 'blink 1.1s step-end infinite',
        float: 'float 3.4s steps(8) infinite',
        scan: 'scan 6.5s steps(30) infinite',
        pulseSoft: 'pulseSoft 2.2s steps(4) infinite',
        fadeIn: 'fadeIn 0.35s steps(4) both',
      },
    },
  },
  plugins: [],
}
