import { Routes } from '@angular/router';
import { pastorRoutes } from './features/pastor/pastor.routes';
import { roleGuard } from './core/guards/role.gaurd';
import { Shell } from './shared/layouts/shell/shell';

export const routes: Routes = [
    {
        path: 'pastor', 
        component: Shell,
        // canActivate: [roleGuard(['pastor'])],
        loadChildren: () => import('./features/pastor/pastor.routes').then(r=>r.pastorRoutes)
    },

    {
        path: 'church_rep', 
        component: Shell,
        // canActivate: [roleGuard(['church_rep'])],
        loadChildren: () => import('./features/church_rep/churchRep.routes').then(r=>r.churchRepRoutes)
    },

];
