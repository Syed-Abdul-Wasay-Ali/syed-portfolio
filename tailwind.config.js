/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // near-black inks — the canvas is a title card now
        ink: {
          DEFAULT: '#050505',
          950: '#070706',
          900: '#0C0C0B',
          800: '#111110',
          700: '#171716',
          600: '#232320',
          500: '#2C2C29',
        },
        // canvas (pure black page)
        canvas: '#050505',
        mist: '#0A0A09',
        // warm off-white text (paper cards)
        snow: '#FAF8F3',
        paper: '#F2EFE8',
        muted: '#96918A',
        // the one accent — deep navy (“green” slot keeps class names working)
        green: {
          DEFAULT: '#1F3A93',
          bright: '#4C6FDE',
          deep: '#0B1846',
        },
        // flat aliases used as `text-greenBright` / `text-greenDeep`
        greenBright: '#4C6FDE',
        greenDeep: '#0B1846',
        // legacy hover slots — now warm neutrals (white hover / taupe metadata)
        neonBlue: '#F2EFE8',
        violet: '#B9AFA3',
        slateAccent: '#B9AFA3',
        // legacy hot-line slot — navy now
        acid: '#1F3A93',
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
