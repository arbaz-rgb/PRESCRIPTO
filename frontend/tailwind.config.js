/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#5f6FFF", // your tutor’s custom color
      },
    },
  },
  plugins: [],
};
