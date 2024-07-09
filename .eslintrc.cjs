const { configure, presets } = require("eslint-kit");
const path = require("path");

module.exports = configure({
  allowDebug: process.env.NODE_ENV !== "production",

  presets: [
    presets.imports({
      alias: {
        paths: {
          "@": path.resolve(__dirname, "./"),
        },
      },
    }),
    presets.node(),
    presets.prettier(),
    presets.typescript(),
    presets.react(),
  ],
  extend: {
    rules: {
      "import/no-default-export": "off",
      "react/style-prop-object": "off",
    },
  },
});
