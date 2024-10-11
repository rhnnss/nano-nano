import type { Config } from "tailwindcss";
const { nextui } = require("@nextui-org/react");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [
    nextui({
      themes: {
        light: {
          boxShadow: {
            DEFAULT: "primary",
            primary: "0px 4px 16px 0px #E4E4E4",
          },
          colors: {
            body: "#FFFFFF",
            "base-color": "#585858",
            primary: {
              DEFAULT: "#0137B8",
              100: "#E6F4FF",
              200: "#A3D4FF",
              300: "#7ABDFF",
              400: "#53A3FF",
              500: "#2A86FF",
              600: "#0167FF",
              700: "#092ED4",
              800: "#0137B8",
              900: "#002270",
              1000: "#000F45",
            },
            secondary: {
              DEFAULT: "#E32935",
              100: "#FFF0F0",
              200: "#FFD4D1",
              300: "#FFABA8",
              400: "#FC7E7E",
              500: "#F05257",
              600: "#E32935",
              700: "#BD1929",
              800: "#960C1F",
              900: "#700216",
              1000: "#4A0110",
            },
            success: {
              DEFAULT: "#0C8843",
              100: "#E4F9EA",
            },
            warning: {
              DEFAULT: "#facc15",
              600: "#facc15",
              400: "#FFDD80",
              300: "#882F00",
              200: "#FFF6D1",
              100: "#FFE7D1",
            },
            danger: {
              DEFAULT: "#DA1A18",
              100: "#FCEAE6",
            },
            gray: {
              DEFAULT: "#E4E4E4",
              100: "#F8F8F8",
              200: "#E4E4E4",
              250: "#B5B5B5",
              300: "#787878",
              400: "#585858",
              500: "#2E2E2E",
            },
          },
        },
      },
    }),
  ],
};
export default config;
