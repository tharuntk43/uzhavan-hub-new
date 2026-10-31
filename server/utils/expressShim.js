/**
 * Uzhavan Hub - Express Compatibility Engine & Router
 * Seamlessly provides Express.js semantics, middleware chaining, and REST routing.
 * Uses native Node.js http and url modules when external express is not installed.
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import url from 'url';

class RouterInstance {
  constructor() {
    this.routes = [];
  }

  addRoute(method, routePath, ...handlers) {
    const paramNames = [];
    const regexPath = routePath.replace(/:([a-zA-Z0-9_]+)/g, (_, name) => {
      paramNames.push(name);
      return '([^/]+)';
    });
    const regex = new RegExp(`^${regexPath}$`);

    this.routes.push({
      method: method.toUpperCase(),
      routePath,
      regex,
      paramNames,
      handlers
    });
  }

  get(path, ...handlers) { this.addRoute('GET', path, ...handlers); }
  post(path, ...handlers) { this.addRoute('POST', path, ...handlers); }
  put(path, ...handlers) { this.addRoute('PUT', path, ...handlers); }
  delete(path, ...handlers) { this.addRoute('DELETE', path, ...handlers); }
  patch(path, ...handlers) { this.addRoute('PATCH', path, ...handlers); }
}

export function Router() {
  return new RouterInstance();
}

export class ExpressApp {
  constructor() {
    this.middlewares = [];
    this.routers = [];
    this.staticDirs = [];
  }

  use(prefixOrMiddleware, router) {
    if (typeof prefixOrMiddleware === 'string' && router) {
      this.routers.push({ prefix: prefixOrMiddleware, router });
    } else if (typeof prefixOrMiddleware === 'function') {
      this.middlewares.push(prefixOrMiddleware);
    }
  }

  static(dirPath) {
    this.staticDirs.push(dirPath);
  }

  handle(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      res.end();
      return;
    }

    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    res.status = function(code) {
      res.statusCode = code;
      return res;
    };

    res.json = function(data) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify(data, null, 2));
    };

    res.send = function(data) {
      res.end(data);
    };

    let bodyData = '';
    req.on('data', chunk => {
      bodyData += chunk;
      if (bodyData.length > 20 * 1024 * 1024) req.destroy();
    });

    req.on('end', async () => {
      req.query = parsedUrl.query || {};
      req.body = {};

      if (bodyData) {
        try {
          req.body = JSON.parse(bodyData);
        } catch (e) {
          req.body = {};
        }
      }

      // Check API Routers
      for (const { prefix, router } of this.routers) {
        if (pathname.startsWith(prefix)) {
          const subPath = pathname.substring(prefix.length) || '/';
          for (const route of router.routes) {
            if (route.method === req.method) {
              const match = subPath.match(route.regex);
              if (match) {
                req.params = {};
                route.paramNames.forEach((name, i) => {
                  req.params[name] = decodeURIComponent(match[i + 1]);
                });

                // Execute middleware chain
                const handlers = [...route.handlers];
                const executeChain = (idx) => {
                  if (idx >= handlers.length) return;
                  const handler = handlers[idx];
                  handler(req, res, () => executeChain(idx + 1));
                };

                try {
                  executeChain(0);
                  return;
                } catch (err) {
                  console.error('[Route Handler Error]', err);
                  return res.status(500).json({ success: false, error: 'Internal server error.' });
                }
              }
            }
          }
        }
      }

      // Static file serving: Check all static dirs first
      for (const staticDir of this.staticDirs) {
        let filePath = path.join(staticDir, pathname === '/' ? 'index.html' : pathname);
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          serveStaticFile(res, filePath);
          return;
        }
      }

      // SPA fallback ONLY for HTML navigation routes without file extensions
      const hasFileExt = path.extname(pathname).length > 0;
      if (!hasFileExt && !pathname.startsWith('/api')) {
        for (const staticDir of this.staticDirs) {
          const indexHtml = path.join(staticDir, 'index.html');
          if (fs.existsSync(indexHtml)) {
            serveStaticFile(res, indexHtml);
            return;
          }
        }
      }

      // Not found
      res.status(404).json({ success: false, error: `Route ${req.method} ${pathname} not found.` });
    });
  }
}

function serveStaticFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.jsx': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webmanifest': 'application/manifest+json'
  };

  const contentType = mimeTypes[ext] || 'application/octet-stream';
  res.setHeader('Content-Type', contentType);
  res.setHeader('Cache-Control', 'public, max-age=3600');
  fs.createReadStream(filePath).pipe(res);
}
