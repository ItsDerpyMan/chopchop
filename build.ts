import * as esbuild from "esbuild";

// Parse command-line arguments
const watch = Deno.args.includes("--watch");

const options: esbuild.BuildOptions = {
  entryPoints: ["js/main.ts"], // Main entry point
  outfile: "dist/bundle.js", // Output file
  bundle: true, // Bundle all dependencies
  format: "esm", // Use ESM for Deno and browser compatibility
  platform: "browser", // Target browser due to `document` usage in viewport.ts
  minify: !watch, // Minify only for production builds
  sourcemap: watch ? "inline" : false, // Sourcemaps for dev
  target: ["es2020", "chrome90", "firefox90"], // Modern browser targets
  logLevel: "info", // Show build info
  external: ["deno-dom"]
};

if (watch) {
  const context = await esbuild.context(options);
  await context.watch();
  console.log("Watching for changes...");
} else {
  await esbuild.build(options);
  console.log("Build completed.");
}
