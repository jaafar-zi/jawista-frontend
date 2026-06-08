import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'about',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'legal/privacy-policy',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'legal/refunds',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'legal/shipping',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'legal/terms-of-service',
    renderMode: RenderMode.Prerender,
  },
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];