import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // All routes use SSR - rendered on each request
  // Prerendering disabled due to localStorage usage in app initialization
  { path: '**', renderMode: RenderMode.Server },
];
