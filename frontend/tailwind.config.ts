import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'retro': {
          primary: '#f4d03f',
          secondary: '#5a6988',
          dark: '#1a1c2c',
          light: '#ffffff',
        }
      },
    },
  },
  plugins: [],
} satisfies Config;
