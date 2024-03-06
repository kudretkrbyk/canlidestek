/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/**/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        CircularSp: ["CircularSp"],
        CircularSpBold: ["CircularSp"],
        CircularSpExtraBold: ["CircularSp"],
      },
    },
  },
  plugins: [],
};
