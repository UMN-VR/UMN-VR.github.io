#!/usr/bin/env node
/** Publish the app and the tour content independently; --dry-run only lists the payload. */
import { execFileSync } from 'node:child_process';
import { readdirSync, realpathSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ghpages from 'gh-pages';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const plans = {
  app: { directory: 'dist-app', add: true, message: 'Update the tour app' },
  content: { directory: 'public', add: true, message: 'Update tour content' },
  full: { directory: 'dist', add: false, message: 'Update the whole site' },
};
const [kind, ...flags] = process.argv.slice(2);
if (!Object.hasOwn(plans, kind) || flags.some(flag => flag !== '--dry-run')) {
  throw new Error('Usage: node tools/deploy.mjs app|content|full [--dry-run]');
}
const plan = plans[kind];
const base = path.join(root, plan.directory);
const files = readdirSync(base, { recursive: true })
  .filter(file => statSync(path.join(base, file)).isFile())
  .map(file => file.split(path.sep).join('/'));

if (kind === 'app') {
  if (!files.includes('tour/twin-cities/index.html')) throw new Error('Build the app first: npm run build:app');
  const content = files.filter(file => file.startsWith('tour/') && !file.endsWith('/index.html'));
  if (content.length) throw new Error(`App output contains tour content; rebuild with npm run build:app: ${content.slice(0, 3).join(', ')}`);
} else {
  // Check references and byte counts before publishing a changed scene or a full site.
  const fossEarth = realpathSync(path.join(root, 'node_modules/foss-earth'));
  execFileSync(process.execPath, [
    path.join(fossEarth, 'scripts/check-scene.mjs'),
    path.join(base, 'tour/twin-cities/scene.json'),
    '--base-url', 'https://umn-vr.github.io/tour/twin-cities/scene.json',
  ], { stdio: 'inherit' });
}

const bytes = files.reduce((sum, file) => sum + statSync(path.join(base, file)).size, 0);
console.log(`${kind}: ${files.length} files, ${(bytes / 1024 / 1024).toFixed(2)} MiB from ${plan.directory}/`);
console.log(plan.add ? 'Existing published files are preserved.' : 'The published site will be replaced by dist/.');
if (flags.includes('--dry-run')) {
  console.log('Dry run: nothing published.');
} else {
  process.chdir(root);
  await new Promise((resolve, reject) => {
    ghpages.publish(base, { add: plan.add, message: plan.message }, error => error ? reject(error) : resolve());
  });
  console.log('Published to gh-pages. GitHub Pages still needs to finish its deployment.');
}
