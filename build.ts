import * as esbuild from "https://deno.land/x/esbuild@v0.25.0/mod.js";
import { denoPlugins } from "https://deno.land/x/esbuild_deno_loader@0.9.0/mod.ts";

const entry = "js/main.js";
try {
    console.log("Resolved entry:", Deno.realPathSync(entry));
    await esbuild.build({
        plugins: [
            ...denoPlugins({
                configPath: Deno.realPathSync("deno.json"),
            }),
        ],
        entryPoints: [entry],
        bundle: true,
        outfile: "build.js",
        platform: "browser",
        // format: "iife",
        sourcemap: true,
        logLevel: "debug",
    });
    console.log("Bundling complete! Output: build.js");
} catch (error) {
    console.error("Build failed:", error.message);
    Deno.exit(1);
} finally {
    await esbuild.stop();
}
