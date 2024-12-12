import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths()],
  optimizeDeps: {
    include: ["lodash"],
    exclude: ["awesome-phonenumber", "twilio"],
  },
  ssr: {
    optimizeDeps: {
      include: ["lodash"],
      exclude: ["awesome-phonenumber", "twilio"],
    },
    noExternal: ["lodash", "foo"],
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
});
