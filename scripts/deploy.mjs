// Publishes dist/ to the gh-pages branch, which GitHub Pages serves at
// https://umn-vr.github.io/. The deploy adds dist/ to what the branch holds and removes
// nothing: the tours' photographs are published apart from the app, and a page already
// open keeps the older app files it asks for. Run npm run build first.
//
//   npm run deploy                       the landing page and the tours
//   npm run deploy -- --media <folder>   also the photographs under <folder>/tour/twin-cities/media/,
//                                        such as ../tour/public after its npm run build:scene
//
// It writes the commit with Git's plumbing, so the branch's 60,000 photographs are never
// checked out.
import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const dist = path.join(root, 'dist')
const index = path.join(root, 'build', 'gh-pages.index')
const env = { ...process.env, GIT_INDEX_FILE: index }
const git = (args, input) => execFileSync('git', args, { cwd: root, env, input, encoding: 'utf8', maxBuffer: 1 << 28, stdio: ['pipe', 'pipe', 'inherit'] }).trim()

const [flag, media] = process.argv.slice(2)
if (flag && (flag !== '--media' || !media)) throw new Error('Usage: node scripts/deploy.mjs [--media <folder>]')
if (!existsSync(path.join(dist, 'tour', 'index.html'))) throw new Error('No site in dist/: run npm run build first.')

/** Every file under `base`, as [its path on the site, its path here]. */
const filesOf = (base, under = '') => readdirSync(path.join(base, under), { recursive: true })
  .map(file => path.join(under, file)).filter(file => statSync(path.join(base, file)).isFile())
  .map(file => [file.split(path.sep).join('/'), path.join(base, file)])
const files = filesOf(dist)
if (media) {
  const photographs = filesOf(path.resolve(media), path.join('tour', 'twin-cities', 'media'))
  if (!photographs.length) throw new Error(`No photographs under ${path.resolve(media)}/tour/twin-cities/media/.`)
  files.push(...photographs)
}

git(['fetch', 'origin', 'gh-pages'])
const parent = git(['rev-parse', 'origin/gh-pages'])
execFileSync('mkdir', ['-p', path.dirname(index)])
git(['read-tree', parent])
const hashes = git(['hash-object', '-w', '--stdin-paths'], files.map(([, file]) => file).join('\n')).split('\n')
git(['update-index', '--add', '--index-info'], files.map(([site], i) => `100644 ${hashes[i]}\t${site}`).join('\n') + '\n')
const tree = git(['write-tree'])
if (tree === git(['rev-parse', `${parent}^{tree}`])) {
  console.log('gh-pages already has this site.')
} else {
  const tour = execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: path.join(root, '..', 'tour'), encoding: 'utf8' }).trim()
  const commit = git(['commit-tree', tree, '-p', parent, '-m', `Deploy the tours at ${tour}${media ? ' with their photographs' : ''}`])
  git(['push', 'origin', `${commit}:refs/heads/gh-pages`])
  console.log(`Deployed the tours at ${tour} to gh-pages: ${files.length} files.`)
}
