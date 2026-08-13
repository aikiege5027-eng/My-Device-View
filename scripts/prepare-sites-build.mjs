import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';

await rm('dist/client', { recursive: true, force: true });
await mkdir('dist/client', { recursive: true });
await Promise.all([
  cp('dist/index.html', 'dist/client/index.html'),
  cp('dist/metadata.json', 'dist/client/metadata.json'),
  cp('dist/_expo', 'dist/client/_expo', { recursive: true }),
]);
await mkdir('dist/server', { recursive: true });
const [workerSource, indexHtml] = await Promise.all([
  readFile('worker.mjs', 'utf8'),
  readFile('dist/index.html', 'utf8'),
]);
await writeFile(
  'dist/server/index.js',
  workerSource.replace('__INDEX_HTML__', JSON.stringify(indexHtml)),
);
