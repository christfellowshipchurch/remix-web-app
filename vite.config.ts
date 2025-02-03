import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ command, mode }) => ({
  build: {
    rollupOptions: {
      input: "./server/app.ts",
      external: [
        "node:stream",
        "node:fs",
        "node:path",
        "node:url",
        "node:crypto",
        "node:http",
        "node:buffer",
        "node:util",
        "node:querystring",
        "node:events",
        "node:net",
        "node:async_hooks",
        "fs",
        "path",
        "url",
        "http",
        "crypto",
        "buffer",
        "querystring",
        "events",
        "net",
        "async_hooks",
        "stream",
        "express",
        "twilio",
      ],
    },
    sourcemap: mode === "development",
    minify: mode === "production",
  },
  resolve: {
    alias: {
      "@": "/app",
    },
  },
  ssr: {
    noExternal: command === "build" ? true : undefined,
    external: [
      "node:stream",
      "node:fs",
      "node:path",
      "node:url",
      "express",
      "twilio",
    ],
  },
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  optimizeDeps: {
    exclude: ["twilio"],
  },
}));
