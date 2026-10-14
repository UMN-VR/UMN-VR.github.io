import { realpathSync } from 'node:fs'
import { checkoutVersion, nodeBuildReader } from '@foss-earth/about/vite'

// The club's version is its commit's, named as FOSS Earth names every checkout's (About's checkoutVersion).
export function clubVersion(root) {
  const top = nodeBuildReader.git(root, ['rev-parse', '--show-toplevel'])
  if (!top || realpathSync(top) !== realpathSync(root)) {
    throw new Error('Cannot determine the club website version: build from its Git checkout with commit history.')
  }
  const version = checkoutVersion(root)
  if (!version) throw new Error('Cannot determine the club website version: its Git history contains no commit date.')
  return version
}
