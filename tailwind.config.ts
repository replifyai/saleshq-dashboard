// Tailwind v4 primarily uses CSS-first config. Keep this file minimal and only
// for plugin compatibility that still expects a JS config.
import type { Config } from "tailwindcss";
import tailwindcssTypography from "@tailwindcss/typography";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  plugins: [tailwindcssTypography, tailwindcssAnimate],
} satisfies Config;
