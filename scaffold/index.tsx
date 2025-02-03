// @deno-types="npm:@types/react"
import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '../src/app.tsx';
import { registerSchemas } from '../schema.ts';

console.log('Initializing application...');

registerSchemas();

const container = document.getElementById('root');
if (!container) {
  console.error('Failed to find root element');
  throw new Error('Failed to find root element');
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
