import { realpath, readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const packageRoot = join(workspaceRoot, 'packages/mobile-design-system');
const peers = [
  'react',
  'react-native',
  'react-native-safe-area-context',
  'react-native-svg',
];

for (const peer of peers) {
  const appPath = await realpath(join(workspaceRoot, 'node_modules', peer));
  const packagePath = await realpath(join(packageRoot, 'node_modules', peer));
  if (appPath !== packagePath) {
    const appVersion = await versionOf(appPath);
    const packageVersion = await versionOf(packagePath);
    throw new Error(
      `${peer} resolves to two physical instances (app ${appVersion}, package ${packageVersion}).`,
    );
  }
}

console.log(`Verified a single workspace instance for ${peers.join(', ')}.`);

async function versionOf(packagePath) {
  const manifest = JSON.parse(await readFile(join(packagePath, 'package.json'), 'utf8'));
  return manifest.version;
}
