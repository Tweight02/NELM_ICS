import { Routes } from '@angular/router';
import { Home } from './home/home';
import { FieldReport } from './field-report/field-report';
import { Announement } from './announement/announement';
import { Reports } from './reports/reports';
import { Tasks } from './tasks/tasks';
import { Church } from './church/church';

export const pastorRoutes: Routes = [
    {path: 'home', component: Home,
        children: [

        ]
    },
    {
        path: 'field-report',
        component: FieldReport
    },
    {
        path: 'report-history',
        component: Reports
    },
    {
        path: 'announcement',
        component: Announement
    },
    {
        path: 'church-report',
        component: Church
    },
    {
        path: 'calendar',
        component: Tasks
    },
    {path: '', redirectTo: 'home', pathMatch: 'full'}
]