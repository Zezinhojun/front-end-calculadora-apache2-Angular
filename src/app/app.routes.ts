import { Routes } from '@angular/router';

import { authGuard } from './shared/guards/auth.guard';
import { guestGuard } from './shared/guards/guest.guard';
import { LayoutComponent } from './shared/layout/layout.component';
import { pacienteResolver } from './shared/guards/paciente.resolver';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/dashboard/dashboard.component'),
      },
      {
        path: 'login',
        canActivate: [guestGuard],
        loadComponent: () => import('./pages/login/login.component'),
      },
      {
        path: 'register',
        canActivate: [guestGuard],
        loadComponent: () => import('./pages/register/register.component'),
      },
      {
        path: 'patientform',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./container/paciente-form/paciente-form.component'),
        resolve: { paciente: pacienteResolver },
      },
      {
        path: 'edit/:lineId',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./container/paciente-form/paciente-form.component'),
        resolve: { paciente: pacienteResolver },
      },
    ],
  },
];
