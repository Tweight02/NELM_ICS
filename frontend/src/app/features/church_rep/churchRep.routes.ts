import { Routes } from '@angular/router';

export const churchRepRoutes: Routes = [
    {
        path: 'home',
        loadComponent: () => import('./home/home').then(m => m.Home),
    },
    {
        path: 'report',
        loadComponent: () => import('./report/report').then(m => m.Report),
    },
    {
        path: 'event',
        loadComponent: () => import('./events/events').then(m=> m.Events)
    },
    {
        path: 'announcement',
        loadComponent: () => import('./announcement/announcement').then(m=>m.Announcement)
    },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
];