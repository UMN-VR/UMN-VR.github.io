// Builds the site into dist/: the club's landing page, which GitHub Pages renders with
// Jekyll (index.md, _config.yml, "Media "), and the campus tours from ../tour/dist, which
// is built first (README). Jekyll leaves out any file whose name starts with "_" or "."
// other than its own config, so the build refuses to produce one.
import { cp, mkdir, readdir, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const tour = path.join(root, '..', 'tour', 'dist')
const dist = path.join(root, 'dist')
// "Media " ends in a space, as it always has: the landing page's links name it so.
const LANDING = ['index.md', '_config.yml', 'Media ']
const notFinder = source => path.basename(source) !== '.DS_Store'

if (!existsSync(path.join(tour, 'tour', 'index.html'))) throw new Error(`No tour build in ${tour}: run npm run build in tour first.`)

await rm(dist, { recursive: true, force: true })
await mkdir(dist)
for (const entry of LANDING) await cp(path.join(root, entry), path.join(dist, entry), { recursive: true, filter: notFinder })
await cp(tour, dist, { recursive: true, filter: notFinder })

const hidden = (await readdir(dist, { recursive: true }))
  .filter(file => file !== '_config.yml' && file.split(path.sep).some(part => part.startsWith('_') || part.startsWith('.')))
if (hidden.length) throw new Error(`Jekyll would drop these built files: ${hidden.join(', ')}`)
console.log(`Built dist/ with the tours from ${tour}`)
