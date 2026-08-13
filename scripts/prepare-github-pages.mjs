import { readFile, writeFile } from 'node:fs/promises';

const basePath = (process.env.GITHUB_PAGES_BASE_PATH ?? '').replace(/^\/+|\/+$/g, '');

if (!basePath) {
  throw new Error('GITHUB_PAGES_BASE_PATH is required');
}

const indexPath = 'dist/index.html';
const indexHtml = await readFile(indexPath, 'utf8');
const basePrefix = `/${basePath}`;
const updatedHtml = indexHtml
  .replaceAll('src="/_expo/', `src="${basePrefix}/_expo/`)
  .replaceAll('href="/_expo/', `href="${basePrefix}/_expo/`);

await writeFile(indexPath, updatedHtml);
await writeFile('dist/.nojekyll', '');
