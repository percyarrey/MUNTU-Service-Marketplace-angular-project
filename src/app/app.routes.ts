import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

/* MODULES */
import { NotFoundComponent } from './modules/extra/not-found/not-found.component';

export const routes: Routes = [
  /* HOME OR CLIENT*/
  {
    path: '',
    loadChildren: () =>
      import('./modules/client/client.module').then((m) => m.ClientModule),
  },

  /* AUTH */
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
    title: 'Muntu | Authentication',
  },

  /* SERVICE PROVIDER*/
  {
    path: 'service-provider',
    loadChildren: () =>
      import('./modules/service-provider/service-provider.module').then(
        (m) => m.ServiceProviderModule
      ),

    /* canActivate: [authGuard], */
    title: 'Muntu | Service Provider',
  },

  /* DASHBOARD*/
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./modules/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),

    /* canActivate: [authGuard], */
    title: 'Muntu | Dashboard',
  },
  { path: '**', component: NotFoundComponent },
];
