import { Routes } from '@angular/router';
import { Bancos, FormasPago } from './ventas';

export const VENTAS_ROUTES: Routes = [
  { path: 'bancos', component: Bancos },
  { path: 'formas-pago', component: FormasPago },
];
