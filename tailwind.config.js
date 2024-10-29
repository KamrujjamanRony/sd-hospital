/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/tw-elements/dist/js/**/*.js"
  ],
  theme: {
    extend: {
      "primary": "#06B2B6",
      "secondary": "#424242",
      "accent": "#606060",
      "neutral": "#3d4451",
      "base-100": "#ffffff",
    },
  },
  darkMode: "class",
  plugins: [require("tw-elements/dist/plugin.cjs")]
}