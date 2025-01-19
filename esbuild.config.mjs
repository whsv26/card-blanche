import esbuild from "esbuild";
import process from "process";

const prod = process.argv[2] === "production";

const context = await esbuild.context({
    entryPoints: ["src/main.ts"],
    bundle: true,
    external: ["obsidian"],
    format: "cjs",
    target: "es2018",
    logLevel: "info",
    sourcemap: prod ? false : "inline",
    treeShaking: true,
    platform: "browser",
    minify: prod,
    outfile: "main.js",
});

if (prod) {
    await context.rebuild();
    process.exit(0);
} else {
    await context.watch();
}
