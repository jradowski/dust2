import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // Ustawienie obsługi motywu oparte na klasie
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "paonrama":"url('/public/panorama.jpg')",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
            "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        'mint': '#52EBC8',
        'lime': '#52EB60',
        'regular-blue': '#52AAEB',
        'light-blue': '#52DBEB',
        'base-orange': '#C27721',
        'fruit-ornge': '#C25B21',
        'light-orange': '#C28D21',
        'pomegranate': '#C23E21',
        'yellow-orange': '#C2A021',
        'blue-50': '#EBF8FF',
        'blue-400': '#63B3ED',
        'gray-100': '#F7FAFC',
        'gray-600': '#718096',
        'gray-800': '#1A202C',


      },
    },
  },
  plugins: [],
};

export default config;
