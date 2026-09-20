/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Sept 2026 — warm light editorial theme: off-white canvas + charcoal
        // + ONE electric lime. The ink scale now feeds LIGHT warm surfaces
        // (cards / hairlines); dark moments live in `charcoal`.
        ink: {
          DEFAULT: '#111111',
          950: '#E9E7DE',
          900: '#E5E3D9',
          800: '#E2DFD5',
          700: '#EAE9E3',
          600: '#D2CDBF',
          500: '#C4BEB0',
          400: '#D8D3C5',
        },
        // canvas (warm off-white page)
        canvas: '#F5F4EF',
        // subtle alt surface (slightly deeper warm)
        mist: '#EFECE4',
        // dark sections (footer, contact band, media chips/scrims)
        charcoal: '#111111',
        // warm light type on dark; paper = primary dark text on light
        snow: '#F7F5ED',
        paper: '#111111',
        muted: '#66645F',
        // the one accent — deep navy in the "green" slot (class names kept)
        green: {
          DEFAULT: '#102A54',
          bright: '#1F4173',
          deep: '#0A1C3A',
        },
        // flat aliases used as `text-greenBright` / `text-greenDeep`
        greenBright: '#1F4173',
        greenDeep: '#0A1C3A',
        // readable accent TEXT on light surfaces (AA on canvas/cards)
        greenReadable: '#1B3A6B',
        // accent on DARK sections — light blue that stays legible on charcoal
        skyBlue: '#9CC0F0',
        // legacy hover slots — now dark/neutral on light
        neonBlue: '#111111',
        violet: '#8A8375',
        slateAccent: '#665F52',
        // legacy hot-line slot — navy now
        acid: '#102A54',
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
