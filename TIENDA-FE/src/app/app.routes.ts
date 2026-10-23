import { Routes } from '@angular/router';
import { authGuard, invitadoGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [invitadoGuard],
    loadComponent: () => import('./modules/auth/login/login').then((m) => m.Login),
  },
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell').then((m) => m.Shell),
    canActivate: [authGuard],
    children: [
      { path: '', loadComponent: () => import('./modules/inicio/inicio').then((m) => m.Inicio) },
      {
        path: 'productos',
        loadChildren: () =>
          import('./modules/productos/productos.routes').then((m) => m.PRODUCTOS_ROUTES),
      },
      {
        path: '**',
        loadComponent: () => import('./modules/pendiente/pendiente').then((m) => m.Pendiente),
      },
    ],
  },
];
