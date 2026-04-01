import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Root path - redirect handled client-side
  { path: '', renderMode: RenderMode.Client },
  // All other routes use SSR
  { path: '**', renderMode: RenderMode.Server },
];
