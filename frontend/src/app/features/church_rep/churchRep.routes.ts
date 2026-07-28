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
    // {
    //     path: 'event',
    //     loadComponent: () => import('./event/event').then(m => m.Event),
    // },
    // {
    //     path: 'notification',
    //     loadComponent: () => import('./notification/notification').then(m => m.Notification),
    // },

    { path: '', redirectTo: 'home', pathMatch: 'full' },
];