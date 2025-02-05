import * as path from "@std/path";
import { compile } from "@goatdb/goatdb/server";

/**
 * Hack: Currently deno installs peer dependencies unconditionally causing both
 * react@19 and react@18 to be pulled into the project and collide. As a
 * workaround, we just delete the unused version before continuing.
 */
export async function fixReact18Dependency(): Promise<void> {
  const denoDir = path.join(Deno.cwd(), "node_modules", ".deno");
  try {
    await Deno.remove(path.join(denoDir, "react@18.3.1"), { recursive: true });
  } catch (_: unknown) {
    // SKip
  }
  try {
    await Deno.remove(path.join(denoDir, "react-dom@18.3.1"), {
      recursive: true,
    });
  } catch (_: unknown) {
    // skip
  }
}

async function main(): Promise<void> {
  await fixReact18Dependency();
  await compile({
    buildDir: "./build",
    serverEntry: "./server.ts",
    jsPath: "./scaffold/index.tsx",
    htmlPath: "./scaffold/index.html",
    cssPath: "./scaffold/index.css",
    assetsPath: "./assets",
  });
  Deno.exit();
}

if (import.meta.main) main();
