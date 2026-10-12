// Serves the built club site. /tour/ is the published tour, so the address bar goes there.
import { createReadStream, existsSync, statSync } from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(fileURLToPath(new URL('..', import.meta.url)), 'dist')
const port = Number(process.env.PORT) || 5174
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', 'http://127.0.0.1')
  if (url.pathname.startsWith('/tour/')) {
    response.writeHead(302, { location: `https://umn-vr.github.io${url.pathname}${url.search}` })
    response.end()
    return
  }
  const pathname = decodeURIComponent(url.pathname).replace(/^\/+/, '')
  let file = path.resolve(root, pathname)
  if (url.pathname.endsWith('/')) file = path.join(file, 'index.html')
  if (!file.startsWith(root + path.sep) && file !== root || !existsSync(file) || !statSync(file).isFile()) {
    response.writeHead(404)
    response.end('Not found')
    return
  }
  response.writeHead(200, { 'content-type': types[path.extname(file)] ?? 'application/octet-stream' })
  createReadStream(file).pipe(response)
})

server.listen(port, '127.0.0.1', () => {
  console.log(`Club site at http://127.0.0.1:${port}/`)
})
