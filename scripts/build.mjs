// Builds the club's static website and its previous homepage archive.
// The tour builds and publishes separately.
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { clubVersion } from './version.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const dist = path.join(root, 'dist')
// "Media " ends in a space, as it always has: the landing page's links name it so.
const LANDING = ['index.html', 'club.css', 'archive', 'Media ']
const notFinder = source => path.basename(source) !== '.DS_Store'
const version = clubVersion(root)
const require = createRequire(path.join(root, 'package.json'))
const themeAssets = ['theme.css', 'theme-page.js'].map(name => ({
  name,
  source: require.resolve(`@foss-earth/ui/${name}`),
}))

await rm(dist, { recursive: true, force: true })
await mkdir(dist)
for (const entry of LANDING) await cp(path.join(root, entry), path.join(dist, entry), { recursive: true, filter: notFinder })
for (const asset of themeAssets) await cp(asset.source, path.join(dist, asset.name))
const homepage = await readFile(path.join(dist, 'index.html'), 'utf8')
await writeFile(path.join(dist, 'index.html'), homepage.replaceAll('{{CLUB_VERSION}}', version))

// Serve the hand-written HTML directly and preserve the archive's source config.
await writeFile(path.join(dist, '.nojekyll'), '')
console.log(`Built dist/ with the club website ${version} and archive.`)
