/** @type {import('tailwindcss').Config} */
module.exports = {
  // hover: só em dispositivos com hover; evita estado "preso" após toque no celular
  future: { hoverOnlyWhenSupported: true },
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Etiqueta de gôndola — paleta da pesquisa.
        // Valores vivem em :root (src/index.css); aqui só viram utilitários com alpha.
        field: "rgb(var(--field) / <alpha-value>)",
        ink: {
          DEFAULT: "rgb(var(--ink) / <alpha-value>)",
          soft: "rgb(var(--ink-soft) / <alpha-value>)",
          line: "rgb(var(--ink-line) / <alpha-value>)",
        },
        paper: { DEFAULT: "rgb(var(--paper) / <alpha-value>)", dim: "rgb(var(--paper-dim) / <alpha-value>)" },
        tag: "rgb(var(--tag) / <alpha-value>)",
        brand: {
          orange: "rgb(var(--brand-orange) / <alpha-value>)",
          orangeHover: "rgb(var(--brand-orange-hover) / <alpha-value>)",
        },
        alert: "rgb(var(--alert) / <alpha-value>)",
        nota: { baixa: "rgb(var(--nota-baixa) / <alpha-value>)", alta: "rgb(var(--nota-alta) / <alpha-value>)" },
      },
      fontFamily: {
        display: ['"Big Shoulders Display"', "Impact", "ui-sans-serif", "sans-serif"],
        sans: ["Barlow", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
      },
      boxShadow: {
        etiqueta: "0 2px 4px rgba(6,14,70,0.18), 0 18px 40px -8px rgba(6,14,70,0.45)",
        cta: "0 6px 14px -4px rgba(11,16,51,0.35)",
      },
      keyframes: {
        "tag-in": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "tag-in": "tag-in 0.55s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [],
}
