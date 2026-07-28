import { Routes } from "@angular/router";

export const secretary: Routes = [
    {
        path: 'home',
        loadComponent: () => import('./home/home').then(m => m.Home),

    },
    {
        path: 'reports',
        loadComponent: () => import('./reports/reports').then(m => m.Reports)
    },
    { 
        path: 'check-report-completenes',
        loadComponent: () => import('./check-report-completeness/check-report-completeness').then(m =>m.CheckReportCompleteness)
    },
    {
        path: 'manage-record-files',
        loadComponent: () => import('./manage-records-files/manage-records-files').then(m => m.ManageRecordsFiles)
    },
    {
        path: 'assist-communication',
        loadComponent: () => import('./assist-communication/assist-communication').then(m => m.AssistCommunication)
    },
    {path: '', redirectTo: 'home', pathMatch: 'full'}
]
