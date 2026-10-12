import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { copyFile, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const root = fileURLToPath(new URL('../', import.meta.url))
const fixtures = process.env.UMN_DEPLOY_TEST_ROOT || path.join(root, 'build', 'checks')

async function fixture(t) {
  await mkdir(fixtures, { recursive: true })
  const folder = await mkdtemp(path.join(fixtures, 'club-build-'))
  t.after(() => rm(folder, { recursive: true, force: true }))
  const club = path.join(folder, 'club')
  await mkdir(path.join(club, 'scripts'), { recursive: true })
  await copyFile(new URL('build.mjs', import.meta.url), path.join(club, 'scripts', 'build.mjs'))
  await copyFile(new URL('version.mjs', import.meta.url), path.join(club, 'scripts', 'version.mjs'))
  const put = async (file, contents) => {
    await mkdir(path.dirname(path.join(club, file)), { recursive: true })
    await writeFile(path.join(club, file), contents)
  }
  await put('index.html', '<h1>The club</h1><span>{{CLUB_VERSION}}</span>\n')
  await put('package.json', JSON.stringify({ name: '@umn-vr/club-site', private: true, type: 'module' }))
  await put('node_modules/@foss-earth/ui/package.json', JSON.stringify({
    name: '@foss-earth/ui',
    type: 'module',
    exports: { './theme.css': './src/theme.css', './theme-page.js': './src/theme-page.js' },
  }))
  await put('node_modules/@foss-earth/ui/src/theme.css', '/* Shared UI theme fixture */\n')
  await put('node_modules/@foss-earth/ui/src/theme-page.js', 'export const sharedTheme = true;\n')
  await put('club.css', 'body { margin: 0; }\n')
  await put('archive/2026-10-11/index.html', '<h1>Previous homepage</h1>\n')
  await put('archive/2026-10-11/index.md', '# The old club\n\nUnchanged source.\n')
  await put('archive/2026-10-11/_config.yml', 'theme: jekyll-theme-cayman\n')
  await put('Media /club.jpg', 'club photograph')
  const git = (args, env = {}) => {
    const result = spawnSync('git', args, { cwd: club, encoding: 'utf8', env: { ...process.env, ...env } })
    assert.equal(result.status, 0, result.stderr)
  }
  git(['init', '-q'])
  const commit = (date, message) => git([
    '-c', 'user.name=Club Build Test', '-c', 'user.email=club-build@example.invalid', '-c', 'commit.gpgsign=false',
    'commit', '--allow-empty', '-q', '-m', message,
  ], { GIT_AUTHOR_DATE: date, GIT_COMMITTER_DATE: date })
  commit('2026-10-10T12:00:00-05:00', 'Previous day')
  commit('2026-10-11T12:00:00-05:00', 'First change')
  commit('2026-10-11T13:00:00-05:00', 'Second change')
  return { club, put, commit, run: () => spawnSync(process.execPath, ['scripts/build.mjs'], { cwd: club, encoding: 'utf8' }) }
}

test('builds the club alone and removes files left by the former combined build', async t => {
  const { club, put, run } = await fixture(t)
  // There is no sibling tour repository or tour build in this fixture.
  await put('dist/tour/index.html', 'an older tour build')
  await put('dist/assets/old-tour.js', 'an older app file')
  await put('Media /.DS_Store', 'Finder metadata')
  await put('archive/.DS_Store', 'Finder metadata')
  await put('.DS_Store', 'Finder metadata')
  const result = run()
  assert.equal(result.status, 0, result.stderr)
  assert.deepEqual((await readdir(path.join(club, 'dist'), { recursive: true })).sort(), [
    '.nojekyll', 'Media ', 'Media /club.jpg', 'archive', 'archive/2026-10-11',
    'archive/2026-10-11/_config.yml', 'archive/2026-10-11/index.html',
    'archive/2026-10-11/index.md', 'club.css', 'index.html', 'theme-page.js', 'theme.css',
  ])
  assert.equal(await readFile(path.join(club, 'dist', '.nojekyll'), 'utf8'), '')
  assert.equal(await readFile(path.join(club, 'dist', 'index.html'), 'utf8'), '<h1>The club</h1><span>26.10.11.#2</span>\n')
  assert.equal(await readFile(path.join(club, 'dist', 'theme.css'), 'utf8'), '/* Shared UI theme fixture */\n')
  assert.equal(await readFile(path.join(club, 'dist', 'theme-page.js'), 'utf8'), 'export const sharedTheme = true;\n')
  assert.equal(await readFile(path.join(club, 'dist', 'archive/2026-10-11/index.md'), 'utf8'), '# The old club\n\nUnchanged source.\n')
  assert.equal(await readFile(path.join(club, 'dist', 'archive/2026-10-11/_config.yml'), 'utf8'), 'theme: jekyll-theme-cayman\n')
})

test('derives the version from Git and resets the revision on a new commit date', async t => {
  const { club, commit, run } = await fixture(t)
  commit('2026-10-12T12:00:00-05:00', 'Next day')
  const result = run()
  assert.equal(result.status, 0, result.stderr)
  assert.equal(await readFile(path.join(club, 'dist', 'index.html'), 'utf8'), '<h1>The club</h1><span>26.10.12.#1</span>\n')
})

test('refuses a version from a parent repository when the club Git checkout is missing', async t => {
  const { club, run } = await fixture(t)
  await rm(path.join(club, '.git'), { recursive: true, force: true })
  const result = run()
  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /Cannot determine the club website version/)
})
