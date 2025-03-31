/** @type {import('tailwindcss').Config} */
import flowbite from "flowbite/plugin";
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js" /* src folder, for example */,
  ],
  theme: {
    extend: {},
  },
  plugins: [flowbite],
};
