import { defineConfig, transformWithOxc } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const transformJsxInJs = () => ({
  name: "transform-jsx-in-js",
  enforce: "pre",
  async transform(code, id) {
    if (!id.match(/.*\.js$/)) {
      return null;
    }

    return await transformWithOxc(code, id, {
      lang: "jsx",
    });
  },
});


const jsAsJsx = { ".js": "jsx" };

export default defineConfig({
  plugins: [react({  include: /\.(jsx|tsx|js)$/}), transformJsxInJs(), tailwindcss()],
  optimizeDeps: {
    rolldownOptions: { moduleTypes: jsAsJsx },
  },
  base: "/EarnRewards/",
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    include: ["src/test/**/*.test.js"],
  },
});
