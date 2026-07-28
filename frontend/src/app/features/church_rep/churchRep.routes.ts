import { Routes } from '@angular/router';

export const churchRepRoutes: Routes = [
    {
        path: 'home',
        loadComponent: () => import('./home/home').then(m => m.Home),
    },
    {
        path: 'field-reports',
        loadComponent: () => import('./report/report').then(m => m.Report),
    },
  
    { path: '', redirectTo: 'home', pathMatch: 'full' },
];