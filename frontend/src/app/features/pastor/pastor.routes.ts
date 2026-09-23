import { Routes } from '@angular/router';

export const pastorRoutes: Routes = [
    {
        path: 'home',
        loadComponent: () => import('./home/home').then(m => m.Home),
    },
    {
        path: 'field-reports',
        loadComponent: () => import('./reports/reports').then(m => m.Reports),
    },
    {
        path: 'field-reports-edit',
        loadComponent: () => import('./edit-reports/edit-reports').then(m => m.EditReports),
    },
    {
        path: 'church-report',
        loadComponent: () => import('./church/church').then(m => m.Church),
    },
    {
        path: 'calendar',
        loadComponent: () => import('./tasks/tasks').then(m => m.Tasks),
    },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
];