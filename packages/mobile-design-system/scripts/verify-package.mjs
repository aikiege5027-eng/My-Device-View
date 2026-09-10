import { access, readFile, readdir } from 'node:fs/promises';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const distRoot = join(packageRoot, 'dist');
const packageJson = JSON.parse(await readFile(join(packageRoot, 'package.json'), 'utf8'));

// `types`, `react-native` and `browser` point at the TypeScript sources so Metro
// and tsc consume the package without a prior build; `import` / `require` keep
// pointing at `dist` for publishing and non-Metro consumers.
for (const subpath of ['.', './tokens']) {
  const entry = packageJson.exports[subpath];
  for (const condition of ['types', 'react-native', 'browser', 'import', 'require']) {
    if (!entry?.[condition]) throw new Error(`Missing ${condition} export for ${subpath}`);
    await access(resolve(packageRoot, entry[condition]));
  }
}

const files = await collectJavaScriptFiles(distRoot);
for (const file of files) {
  const source = await readFile(file, 'utf8');
  if (/require\(["'][^"']+\.svg["']\)/.test(source)) {
    throw new Error(`Published JavaScript still depends on a raw SVG: ${file}`);
  }

  for (const match of source.matchAll(/require\(["'](\.{1,2}\/[^"']+)["']\)/g)) {
    const target = resolve(dirname(file), match[1]);
    const candidates = extname(target) ? [target] : [`${target}.js`, join(target, 'index.js')];
    if (!(await anyAccessible(candidates))) {
      throw new Error(`Unresolved relative require ${match[1]} in ${file}`);
    }
  }
}

console.log(`Verified ${files.length} published JavaScript files and all package exports.`);

async function collectJavaScriptFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory()
        ? collectJavaScriptFiles(path)
        : Promise.resolve(entry.name.endsWith('.js') ? [path] : []);
    }),
  );
  return nested.flat();
}

async function anyAccessible(paths) {
  for (const path of paths) {
    try {
      await access(path);
      return true;
    } catch {
      // Continue checking supported CommonJS resolution candidates.
    }
  }
  return false;
}
