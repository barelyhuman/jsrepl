import esbuild from "npm:esbuild";

const ctx = await esbuild.context({
  entryPoints: ["src/main.tsx"],
  bundle: true,
  jsxImportSource: "preact",
  jsx: "automatic",
  outdir: "dist",
  format: "esm",
});

const isWatchMode = Deno.args.includes("-w");
if (isWatchMode) {
  await ctx.watch();
  await ctx.rebuild();
} else {
  await ctx.rebuild();
  await ctx.dispose();
}
