import { cp, mkdir, rm } from 'node:fs/promises';

await rm('dist/client', { recursive: true, force: true });
await mkdir('dist/client', { recursive: true });
await Promise.all([
  cp('dist/index.html', 'dist/client/index.html'),
  cp('dist/metadata.json', 'dist/client/metadata.json'),
  cp('dist/_expo', 'dist/client/_expo', { recursive: true }),
]);
await mkdir('dist/server', { recursive: true });
await cp('worker.mjs', 'dist/server/index.js');
