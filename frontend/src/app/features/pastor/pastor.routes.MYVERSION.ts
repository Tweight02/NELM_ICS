import { Routes } from '@angular/router';
import { Home } from './home/home';
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
        component: Reports
    },
    {
        path: 'report-history',
        component: Reports
    },
    {path: '', redirectTo: 'home', pathMatch: 'full'}
]