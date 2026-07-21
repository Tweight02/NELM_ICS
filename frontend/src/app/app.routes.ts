import { Routes } from '@angular/router';
import { pastorRoutes } from './features/pastor/pastor.routes';
import { roleGuard } from './core/guards/role.gaurd';
import { Shell } from './shared/layouts/shell/shell';

export const routes: Routes = [
    {
        path: '', 
        component: Shell,
        // canActivate: [roleGuard(['pastor'])],
        loadChildren: () => import('./features/pastor/pastor.routes').then(r=>pastorRoutes)
    }
];
