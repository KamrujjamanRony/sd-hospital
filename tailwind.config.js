/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/tw-elements/dist/js/**/*.js"
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ["light", {
      mytheme: {
        "primary": "#362E94",
        "secondary": "#f6d860",
        "accent": "#37cdbe",
        "neutral": "#3d4451",
        "base-100": "#ffffff",
      },
    },],
  },
  darkMode: "class",
  plugins: [require("tw-elements/dist/plugin.cjs"), require("daisyui")]
}