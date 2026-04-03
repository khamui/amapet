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

const SITE_URL = process.env['SITE_URL'] || 'https://www.helpa.ws';
const API_URL = process.env['API_URL'] || 'http://localhost:3000';

/**
 * Set Cross-Origin-Opener-Policy to allow OAuth popups to communicate back
 */
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
});

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
 * Sitemap cache
 */
let sitemapCache: { xml: string; timestamp: number } | null = null;
const SITEMAP_TTL_MS = 60 * 60 * 1000; // 1 hour

interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: number;
}

function generateSitemapXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map(
      (e) => `  <url>
    <loc>${e.loc}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

/**
 * GET /sitemap.xml - Dynamic sitemap
 */
app.get('/sitemap.xml', async (_req, res) => {
  try {
    // Check cache
    if (sitemapCache && Date.now() - sitemapCache.timestamp < SITEMAP_TTL_MS) {
      res.type('application/xml').send(sitemapCache.xml);
      return;
    }

    // Fetch data from backend
    const response = await fetch(`${API_URL}/sitemap/data`);
    if (!response.ok) {
      throw new Error('Failed to fetch sitemap data');
    }

    const entries: SitemapEntry[] = await response.json();
    const xml = generateSitemapXml(entries);

    // Cache and serve
    sitemapCache = { xml, timestamp: Date.now() };
    res.type('application/xml').send(xml);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).send('Error generating sitemap');
  }
});

/**
 * POST /api/sitemap/invalidate - Internal endpoint to clear cache
 */
app.post('/api/sitemap/invalidate', (_req, res) => {
  sitemapCache = null;
  res.status(204).send();
});

/**
 * GET /robots.txt
 */
app.get('/robots.txt', (_req, res) => {
  res.type('text/plain').send(`User-agent: *
Allow: /
Sitemap: ${SITE_URL}/sitemap.xml`);
});

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
