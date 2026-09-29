import { createReadStream, realpathSync } from 'node:fs';
import { realpath, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { fileURLToPath } from 'node:url';

const root = realpathSync(fileURLToPath(new URL('.', import.meta.url)));
const portArgument = process.argv.indexOf('--port');
const portValue = portArgument === -1 ? (process.env.PORT ?? '4173') : process.argv[portArgument + 1];
const port = Number(portValue);

if (!/^\d+$/.test(portValue ?? '') || !Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('Provide a port from 1 to 65535 using PORT or --port.');
  process.exit(1);
}

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf',
};

function reply(request, response, status, message, headers = {}) {
  response.writeHead(status, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Content-Length': Buffer.byteLength(message),
    'X-Content-Type-Options': 'nosniff',
    ...headers,
  });
  response.end(request.method === 'HEAD' ? undefined : message);
}

const server = createServer(async (request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    reply(request, response, 405, 'Method not allowed\n', { Allow: 'GET, HEAD' });
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent((request.url ?? '/').split('?')[0]);
  } catch {
    reply(request, response, 400, 'Bad request\n');
    return;
  }

  const segments = pathname.split(/[\\/]/);
  if (!pathname.startsWith('/') || pathname.includes('\0') || segments.some(segment => segment.startsWith('.') || segment.toLowerCase() === 'node_modules')) {
    reply(request, response, 404, 'Not found\n');
    return;
  }

  try {
    const filename = await realpath(resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`));
    if (!filename.startsWith(`${root}${sep}`)) {
      reply(request, response, 404, 'Not found\n');
      return;
    }

    const info = await stat(filename);
    if (!info.isFile()) {
      reply(request, response, 404, 'Not found\n');
      return;
    }

    response.writeHead(200, {
      'Content-Type': contentTypes[extname(filename).toLowerCase()] ?? 'application/octet-stream',
      'Content-Length': info.size,
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff',
    });

    if (request.method === 'HEAD') {
      response.end();
      return;
    }

    await pipeline(createReadStream(filename), response);
  } catch (error) {
    if (response.headersSent || response.destroyed) return;
    const missing = ['ENOENT', 'ENOTDIR', 'EACCES', 'EPERM'].includes(error.code);
    reply(request, response, missing ? 404 : 500, missing ? 'Not found\n' : 'Server error\n');
  }
});

server.on('error', error => {
  console.error(`Unable to start the local server: ${error.message}`);
  process.exitCode = 1;
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Accurate Ozone is available at http://127.0.0.1:${port}`);
});
