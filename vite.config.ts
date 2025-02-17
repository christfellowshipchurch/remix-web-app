import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import netlifyPlugin from "@netlify/vite-plugin-react-router";
import path from "path";

export default defineConfig(({ isSsrBuild, command }) => ({
  build: {
    rollupOptions: isSsrBuild
      ? {
          input: "./server/app.ts",
        }
      : {
          external: ["fs", "path", "url"],
        },
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./app"),
    },
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  ssr: {
    noExternal: command === "build" ? ["fs", "path", "url"] : undefined,
  },
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths(), netlifyPlugin()],
  optimizeDeps: {
    exclude: ["twilio"],
  },
}));
