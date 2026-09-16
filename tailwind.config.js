/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "SF Pro Text",
          "Inter",
          "system-ui",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      borderRadius: {
        "apple-lg": "1.5rem",
        "apple-md": "1rem",
        "apple-sm": "0.75rem",
      },
      boxShadow: {
        "apple-sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        "apple-md":
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
        "apple-lg":
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
        "apple-xl":
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        "apple-blue":
          "0 4px 14px 0 rgba(37, 99, 235, 0.35)",
      },
      fontSize: {
        headline: [
          "clamp(2rem, 5vw, 3rem)",
          {
            lineHeight: "1.1",
            fontWeight: "700",
          },
        ],
        subhead: [
          "clamp(1.25rem, 2.5vw, 1.5rem)",
          {
            lineHeight: "1.4",
            fontWeight: "500",
          },
        ],
      },
      transitionTimingFunction: {
        apple: "cubic-bezier(0.25, 0.1, 0.25, 1)",
      },
    },
  },
  plugins: [],
}
