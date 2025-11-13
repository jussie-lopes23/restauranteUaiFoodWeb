/** @type {import('tailwindcss').Config} */
export default {
  // Este é o passo que estava faltando:
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Diz ao Tailwind para escanear seus arquivos React
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}