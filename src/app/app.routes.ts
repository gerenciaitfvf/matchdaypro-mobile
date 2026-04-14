import { Routes } from '@angular/router';
import { publicGuard } from './guards/public.guard';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'folder',
    loadComponent: () =>
      import('./pages/folder/folder.page').then((m) => m.FolderPage),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage),
    canActivate: [publicGuard],
  },
];
