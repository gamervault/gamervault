import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-primary-black": "#090A0C",
        "bg-stroke-grey": "#12151C",
        "off-white": "#EBEBEB",
        "text-secondary-grey": "#3B414E",
        "light-pink": "#D82D7E",
        "text-primary-light-grey": "#ABB7C8",
        "dark-blue": "#29638E",
        "blue": "#3277A8",
        "light-blue": "#8DCFFF",
      },
      boxShadow: {
        "center": "0 0px 5px rgba(0,0,0,0.15)"
      }
    },
  },
  plugins: [],
  mode: "jit"
};
export default config;
