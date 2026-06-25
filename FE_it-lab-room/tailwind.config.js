/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Bảng màu thương hiệu, màu chính tương ứng Color(0xFF193D87).
        blue: {
          50: "#F3F6FC",
          100: "#E6ECF8",
          200: "#C9D5ED",
          300: "#9DB3DD",
          400: "#193D87",
          500: "#193D87",
          600: "#193D87",
          700: "#193D87",
          800: "#193D87",
          900: "#102752",
          950: "#09152E",
        },
      },
    },
  },
  plugins: [],
};
