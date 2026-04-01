import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // All routes use SSR
  { path: '**', renderMode: RenderMode.Server },
];
