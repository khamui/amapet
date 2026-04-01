import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Simple in-memory cache for SSR responses
 */
const CACHE_TTL_MS = 60 * 1000; // 60 seconds
const cache = new Map<string, { html: string; timestamp: number }>();

function getCachedResponse(url: string): string | null {
  const entry = cache.get(url);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(url);
    return null;
  }
  return entry.html;
}

function setCachedResponse(url: string, html: string): void {
  cache.set(url, { html, timestamp: Date.now() });
}

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 * Uses in-memory cache for GET requests to reduce CPU load.
 */
app.use(async (req, res, next) => {
  // Only cache GET requests
  if (req.method === 'GET') {
    const cachedHtml = getCachedResponse(req.url);
    if (cachedHtml) {
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('X-Cache', 'HIT');
      res.send(cachedHtml);
      return;
    }
  }

  try {
    const response = await angularApp.handle(req);
    if (response) {
      // Cache GET responses
      if (req.method === 'GET') {
        const html = await response.text();
        setCachedResponse(req.url, html);
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('X-Cache', 'MISS');
        res.send(html);
      } else {
        writeResponseToNodeResponse(response, res);
      }
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
