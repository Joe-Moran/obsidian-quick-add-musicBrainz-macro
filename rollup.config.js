import command from "rollup-plugin-command";
import convert from './convert.js';

export default {
  input: "index.js",
  output: {
    file: "dist/main.js",
    format: "cjs",
  },
  plugins: [
    command(convert),
  ],
};
