import { sentryVitePlugin } from "@sentry/vite-plugin";
import { unstable_vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), remix({
    ignoredRouteFiles: ["**/.*"],
  }), sentryVitePlugin({
    org: "ryan-yogan-81ab02b9",
    project: "choring"
  })],

  build: {
    sourcemap: true,
  },
});