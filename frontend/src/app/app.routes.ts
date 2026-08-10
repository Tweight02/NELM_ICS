import { Routes } from '@angular/router';
import { pastorRoutes } from './features/pastor/pastor.routes';

import { Shell } from './shared/layouts/shell/shell';

export const routes: Routes = [
    {
        path: 'pastor', 
        component: Shell,
        // canActivate: [roleGuard('pastor')],
        loadChildren: () => import('./features/pastor/pastor.routes').then(r=>r.pastorRoutes)
    },
    {
        path: 'secretary',
        component: Shell,
        // canActivate: [roleGuard('secretary')],
        loadChildren: () =>import('./features/secretary/secretary.routes').then(r=>r.secretary)
    },
    {
        path: 'login',
        loadComponent: () =>import('./auth/login/login').then(m=>m.Login)
    }
];
