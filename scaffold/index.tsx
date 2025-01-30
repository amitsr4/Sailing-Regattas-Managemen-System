// // deno-lint-ignore no-unused-vars
// import React from 'react';
// import { createRoot } from 'react-dom/client';
// import { App } from '../src/app.tsx';
// import { registerSchemas } from '../schema.ts';

// registerSchemas();

// const domNode = document.getElementById('root')!;

// const root = createRoot(domNode);
// root.render(<App />);
import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '../src/app.tsx';

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
