import { Routes } from '@angular/router';
import { ManageRole } from './manage-role/manage-role';
import { Report } from './report/report';

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
        loadComponent: () => import('./events/events').then(m=> m.Events),
    },
    {
        path: 'event/create-event',
        loadComponent: () => import('./create-event/create-event').then(m => m.CreateEvent),
    },
    {
        path: 'event/manage-event/:event_id',
        loadComponent: () => import('./manage-event/manage-event').then(m => m.ManageEvent),
    },
    {
        path: 'stewardship',
        loadComponent: () => import('./stewarsdship/stewarsdship').then(m => m.Stewarsdship),
    },
    {
        path: 'announcement',
        loadComponent: () => import('./announcement/announcement').then(m=>m.Announcement)
    },
    {
        path: 'manage-roles',
        loadComponent: () => import('./manage-role/manage-role').then(m=>ManageRole)
    },
    {
        path: 'monitoring',
        loadComponent: () => import('./report/report').then(m=>Report)
    },
    {
        path: 'monitoring/:departmentId',
        loadComponent: () => import('./report-monitoring/report-monitoring').then(m => m.ReportMonitoringComponent)
    },
];  