/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: "hsl(var(--brand))",
        "brand-foreground": "hsl(var(--brand-foreground))",
      },
      borderRadius: { xl: "var(--radius)" },
      fontFamily: {
        sans: ["Open Sans", "sans-serif"],
        funnel: ["Funnel", "sans-serif"],
      },
    },
  },
  plugins: [],
};
