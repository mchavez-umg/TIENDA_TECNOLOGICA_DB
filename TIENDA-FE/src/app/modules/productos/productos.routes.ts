import { Routes } from '@angular/router';

export const PRODUCTOS_ROUTES: Routes = [
  { path: 'marcas', loadComponent: () => import('./marcas/marcas').then((m) => m.Marcas) },
];
