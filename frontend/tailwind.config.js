/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tema IAAD Project: biru-teal-hijau
        primary: '#0e7490',    // cyan-700 (biru teal)
        secondary: '#0891b2',  // cyan-600
        accent: '#10b981',     // emerald-500 (hijau aksen logo)
        dark: '#0c4a6e',       // sky-900
        ink: '#0f172a',        // slate-900 untuk teks
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 24px -8px rgba(14, 116, 144, 0.18)',
        glow: '0 8px 32px -8px rgba(8, 145, 178, 0.4)',
      },
    },
  },
  plugins: [],
}
