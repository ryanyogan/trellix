import { unstable_vitePlugin as remix } from "@remix-run/dev";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { remixDevTools } from "remix-development-tools/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    remixDevTools(),
    tsconfigPaths(),
    remix({
      ignoredRouteFiles: ["**/.*"],
    }),
    sentryVitePlugin({
      org: "ryan-yogan-81ab02b9",
      project: "choring",
    }),
  ],

  build: {
    sourcemap: true,
  },
});
