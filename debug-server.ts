import { startDebugServer } from "@goatdb/goatdb/server";
import { registerSchemas } from "./schema.ts";
import { fixReact18Dependency } from "./build.ts";

async function main(): Promise<void> {
  console.log("Starting debug server...");
  await fixReact18Dependency();

  try {
    registerSchemas();
    console.log("Schemas registered");

    await startDebugServer({
      buildDir: "./build",
      path: "./server-data",
      jsPath: "./scaffold/index.tsx",
      htmlPath: "./scaffold/index.html",
      cssPath: "./scaffold/index.css",
      assetsPath: "./assets",
      watchDir: "./",
    });

    console.log("Debug server started successfully");
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

if (import.meta.main) main();
