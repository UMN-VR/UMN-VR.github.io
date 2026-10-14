// Publishes only the club website. The tour deploys from UMN-VR/tour.
// Existing published files remain available for older pages and archived links.
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { recordBuildInputs } from '@foss-earth/about/vite'

const ROOT = fileURLToPath(new URL('../', import.meta.url))

export function publishClub({ root = ROOT, remote = 'origin', dryRun = false, log = console.log } = {}) {
  const dist = path.join(root, 'dist')
  const required = ['index.html', 'club.css', 'theme.css', 'theme-page.js', '.nojekyll']
  for (const file of required) {
    if (!existsSync(path.join(dist, file))) throw new Error(`No club build: missing ${file}. Run npm run build first.`)
  }
  const collect = (under = '') => readdirSync(path.join(dist, under), { withFileTypes: true }).flatMap(entry => {
    if (entry.name === '.DS_Store') return []
    const name = path.posix.join(under, entry.name)
    if (entry.isSymbolicLink()) throw new Error(`Refusing a symbolic link: ${name}`)
    if (/[\r\n\t\0]/.test(name) || (entry.name.startsWith('.') && name !== '.nojekyll')) throw new Error(`Invalid publishing path: ${name}`)
    if (entry.isDirectory()) return collect(name)
    if (!entry.isFile()) throw new Error(`Not a regular file: ${name}`)
    return [[name, path.join(dist, name)]]
  })
  const files = collect()
  for (const [name] of files) {
    if (!required.includes(name) && !name.startsWith('archive/') && !name.startsWith('Media /')) {
      throw new Error(`File outside the club website: ${name}. Publish the tour from its own repository.`)
    }
  }
  const stateRoot = process.env.CLUB_DEPLOY_STATE_ROOT || path.join(root, 'build')
  mkdirSync(stateRoot, { recursive: true })
  const state = mkdtempSync(path.join(stateRoot, 'deploy-'))
  const env = { ...process.env, GIT_INDEX_FILE: path.join(state, 'index') }
  const git = (args, input) => execFileSync('git', ['-c', 'pack.threads=2', ...args], {
    cwd: root, env, input, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024, stdio: ['pipe', 'pipe', 'inherit'],
  }).trim()
  try {
    git(['fetch', '--no-tags', '--', remote, 'refs/heads/gh-pages'])
    const parent = git(['rev-parse', 'FETCH_HEAD'])
    git(['read-tree', parent])
    const hashes = git(['hash-object', '-w', '--stdin-paths'], files.map(([, file]) => JSON.stringify(file)).join('\n')).split('\n')
    git(['update-index', '--add', '--index-info'], files.map(([name], i) => `100644 ${hashes[i]}\t${name}`).join('\n') + '\n')
    const tree = git(['write-tree'])
    if (tree === git(['rev-parse', `${parent}^{tree}`])) {
      log('The club publishing branch already has this website.')
      return { changed: false, commit: parent, tree }
    }
    const source = git(['rev-parse', '--short=12', 'HEAD'])
    // Against the checkout's own index: the publishing index holds gh-pages, not this branch.
    const dirty = execFileSync('git', ['status', '--short', '--', 'index.html', 'club.css', 'archive', 'scripts', 'package.json'], { cwd: root, encoding: 'utf8' }).trim()
    const commit = git(['commit-tree', tree, '-p', parent, '-m', `Deploy the club website at ${source}${dirty ? '-dirty' : ''}`])
    if (dryRun) log(`Prepared club deployment ${commit}; no publishing branch was updated.`)
    else {
      git(['push', '--', remote, `${commit}:refs/heads/gh-pages`])
      log(`Published the club website: ${files.length} updated files.`)
    }
    return { changed: true, commit, tree }
  } finally { rmSync(state, { recursive: true, force: true }) }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2)
  if (args.some(arg => arg !== '--dry-run')) throw new Error('Usage: npm run deploy -- [--dry-run]. Photograph uploads now use npm run deploy -- --media <public folder> in the tour repository.')
  const dryRun = args.includes('--dry-run')
  // What the club is built from, FOSS Earth's theme, in deployed-from.json, so a new theme is a new version.
  recordBuildInputs({ root: ROOT, dryRun })
  execFileSync('npm', ['run', 'build'], { cwd: ROOT, stdio: 'inherit' })
  publishClub({ dryRun })
}
