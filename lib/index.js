/**
 * dsh-shenhai-skin — host half.
 *
 * Serves the skin video (with HTTP Range support, so the browser can loop and
 * seek it) and a tiny configuration document for the browser half. The browser
 * half is a client plugin that mounts the video behind the Web shell and makes
 * the shell surfaces translucent.
 *
 * The video defaults to `assets/skin.mp4` inside this package. Point
 * `config.videoPath` at any absolute file path to use another video.
 */
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { dirname, isAbsolute, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const name = 'shenhai-skin'

/** The Web server owns the routes this plugin mounts. */
export const inject = ['webServer']

const PACKAGE_ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
const DEFAULT_VIDEO = resolve(PACKAGE_ROOT, 'assets/skin.mp4')

const VIDEO_ROUTE = '/dsh-shenhai-skin/video.mp4'
const CONFIG_ROUTE = '/dsh-shenhai-skin/config.json'

const MUSIC_ROUTES = [
  {
    path: '/dsh-shenhai-skin/music/fuguang.mp3',
    file: resolve(PACKAGE_ROOT, 'assets/music/fuguang.mp3'),
    contentType: 'audio/mpeg',
  },
  {
    path: '/dsh-shenhai-skin/music/linguang.mp3',
    file: resolve(PACKAGE_ROOT, 'assets/music/linguang.mp3'),
    contentType: 'audio/mpeg',
  },
]

const IMAGE_ROUTES = [
  {
    path: '/dsh-shenhai-skin/logo.png',
    file: resolve(PACKAGE_ROOT, 'assets/logo.png'),
    contentType: 'image/png',
  },
  {
    path: '/dsh-shenhai-skin/promo.jpg',
    file: resolve(PACKAGE_ROOT, 'assets/promo.jpg'),
    contentType: 'image/jpeg',
  },
  {
    path: '/dsh-shenhai-skin/humpback.png',
    file: resolve(PACKAGE_ROOT, 'assets/humpback.png'),
    contentType: 'image/png',
  },
]

const DEFAULT_SETTINGS = Object.freeze({
  opacity: 0.72,
  blur: 0,
  dim: 0.18,
})

function resolveVideoPath(config) {
  const configured = typeof config?.videoPath === 'string' ? config.videoPath.trim() : ''
  if (configured === '') return DEFAULT_VIDEO
  return isAbsolute(configured) ? configured : resolve(configured)
}

function numberIn(value, fallback, min, max) {
  const parsed = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(parsed)) return fallback
  return Math.min(max, Math.max(min, parsed))
}

function settingsOf(config) {
  return {
    opacity: numberIn(config?.opacity, DEFAULT_SETTINGS.opacity, 0.3, 1),
    blur: numberIn(config?.blur, DEFAULT_SETTINGS.blur, 0, 24),
    dim: numberIn(config?.dim, DEFAULT_SETTINGS.dim, 0, 0.6),
  }
}

function json(res, status, body, extraHeaders = {}) {
  const payload = Buffer.from(JSON.stringify(body))
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': String(payload.length),
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
    ...extraHeaders,
  })
  res.end(payload)
}

function methodNotAllowed(res, allow) {
  res.writeHead(405, { allow, 'content-length': '0' })
  res.end()
}

/** Parse one single-range `bytes=` header. Returns null for malformed/multi-range. */
function parseRange(header, total) {
  const match = /^bytes=(\d*)-(\d*)$/.exec(String(header).trim())
  if (match === null) return null
  const [, rawStart, rawEnd] = match
  if (rawStart === '' && rawEnd === '') return null
  let start
  let end
  if (rawStart === '') {
    const suffix = Number(rawEnd)
    if (!Number.isSafeInteger(suffix) || suffix <= 0) return null
    start = Math.max(0, total - suffix)
    end = total - 1
  } else {
    start = Number(rawStart)
    end = rawEnd === '' ? total - 1 : Number(rawEnd)
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end)) return null
    if (start >= total) return { unsatisfiable: true }
    if (start > end) return null
    end = Math.min(end, total - 1)
  }
  return { start, end }
}

async function serveFile(req, res, filePath, contentType, errorCode) {
  let info
  try {
    info = await stat(filePath)
  } catch {
    info = null
  }
  if (info === null || !info.isFile()) {
    json(res, 404, { error: errorCode + '-not-found', path: filePath })
    return
  }

  const total = info.size
  const etag = '"' + total.toString(16) + '-' + Math.floor(info.mtimeMs).toString(16) + '"'
  if (String(req.headers['if-none-match'] ?? '') === etag) {
    res.writeHead(304, { etag })
    res.end()
    return
  }

  const headers = {
    'content-type': contentType,
    'accept-ranges': 'bytes',
    'cache-control': 'public, max-age=3600',
    etag,
  }

  const rangeHeader = req.headers.range
  if (typeof rangeHeader === 'string' && rangeHeader !== '') {
    const range = parseRange(rangeHeader, total)
    if (range === null) {
      res.writeHead(200, { ...headers, 'content-length': String(total) })
      if (req.method === 'HEAD') { res.end(); return }
      streamFile(req, res, filePath)
      return
    }
    if (range.unsatisfiable === true) {
      res.writeHead(416, { ...headers, 'content-range': `bytes */${total}`, 'content-length': '0' })
      res.end()
      return
    }
    const { start, end } = range
    res.writeHead(206, {
      ...headers,
      'content-range': `bytes ${start}-${end}/${total}`,
      'content-length': String(end - start + 1),
    })
    if (req.method === 'HEAD') { res.end(); return }
    streamFile(req, res, filePath, start, end)
    return
  }

  res.writeHead(200, { ...headers, 'content-length': String(total) })
  if (req.method === 'HEAD') { res.end(); return }
  streamFile(req, res, filePath)
}

function streamFile(req, res, filePath, start, end) {
  const stream = start === undefined
    ? createReadStream(filePath)
    : createReadStream(filePath, { start, end })
  stream.on('error', () => {
    if (!res.headersSent) {
      json(res, 500, { error: 'skin-asset-read-failed' })
    } else {
      res.destroy()
    }
  })
  res.on('close', () => stream.destroy())
  stream.pipe(res)
}

export function apply(ctx, config) {
  const videoPath = resolveVideoPath(config)
  const settings = settingsOf(config)

  ctx.effect(() => ctx.webServer.register({
    kind: 'exact',
    path: VIDEO_ROUTE,
    handler: async (req, res) => {
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        methodNotAllowed(res, 'GET, HEAD')
        return
      }
      await serveFile(req, res, videoPath, 'video/mp4', 'skin-video')
    },
  }), 'shenhai-skin: skin video route')

  for (const asset of [...MUSIC_ROUTES, ...IMAGE_ROUTES]) {
    ctx.effect(() => ctx.webServer.register({
      kind: 'exact',
      path: asset.path,
      handler: async (req, res) => {
        if (req.method !== 'GET' && req.method !== 'HEAD') {
          methodNotAllowed(res, 'GET, HEAD')
          return
        }
        await serveFile(req, res, asset.file, asset.contentType, 'skin-asset')
      },
    }), `shenhai-skin: ${asset.path}`)
  }

  ctx.effect(() => ctx.webServer.register({
    kind: 'exact',
    path: CONFIG_ROUTE,
    handler: (req, res) => {
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        methodNotAllowed(res, 'GET, HEAD')
        return
      }
      json(res, 200, {
        version: '0.4.3',
        video: { url: 'dsh-shenhai-skin/video.mp4' },
        assets: {
          logo: 'dsh-shenhai-skin/logo.png',
          promo: 'dsh-shenhai-skin/promo.jpg',
          music: [
            'dsh-shenhai-skin/music/fuguang.mp3',
            'dsh-shenhai-skin/music/linguang.mp3',
          ],
        },
        defaults: settings,
      })
    },
  }), 'shenhai-skin: skin config route')
}
