import { startDebugServer } from '@goatdb/goatdb/server';
import { registerSchemas } from './schema.ts';

async function main(): Promise<void> {
  console.log('Starting debug server...');

  registerSchemas();
  console.log('Schemas registered');

  await startDebugServer({
    buildDir: './build',
    path: './server-data',
    jsPath: './scaffold/index.tsx',
    htmlPath: './scaffold/index.html',
    cssPath: './scaffold/index.css',
    assetsPath: './assets',
    watchDir: './',
  });
}

if (import.meta.main) main();
