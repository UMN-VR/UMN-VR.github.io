import { execFileSync } from 'node:child_process'
import { realpathSync } from 'node:fs'

// Same commit date and same-day revision convention as Foss Earth's About build.
export function clubVersion(root) {
  let history
  try {
    const git = args => execFileSync('git', args, {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      timeout: 10_000,
    }).trim()
    if (realpathSync(git(['rev-parse', '--show-toplevel'])) !== realpathSync(root)) {
      throw new Error('The club directory is not the Git repository root.')
    }
    history = git(['log', '-n400', '--date=short', '--format=%cd'])
  } catch {
    throw new Error('Cannot determine the club website version: build from its Git checkout with commit history.')
  }
  const days = history.split('\n')
  const date = /^(\d{4})-(\d{2})-(\d{2})$/.exec(days[0] ?? '')
  if (!date) throw new Error('Cannot determine the club website version: its Git history contains no commit date.')
  const revision = days.filter(day => day === days[0]).length
  return `${date[1].slice(2)}.${date[2]}.${date[3]}.#${revision}`
}
