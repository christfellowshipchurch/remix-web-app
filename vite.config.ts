import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

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
        "twilio",
      ],
    },
    sourcemap: mode === "development",
    minify: mode === "production",
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./app"),
      "@": "/app",
    },
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  ssr: {
    noExternal: [
      ...(command === "serve"
        ? []
        : [
            "@react-router/express",
            "@react-router/node",
            "express",
            "react-router",
            "react",
          ]),
    ],
    external: ["node:stream", "node:fs", "node:path", "node:url", "twilio"],
    target: "node",
    format: "esm",
  },
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  optimizeDeps: {
    exclude: ["twilio"],
    include: ["@react-router/express"],
  },
}));
