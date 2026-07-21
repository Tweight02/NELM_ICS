import { Routes } from '@angular/router';
import { Home } from './home/home';

export const pastorRoutes: Routes = [
    {path: 'PastorPage', component: Home,
        children: [

        ]
    },
    {path: '', redirectTo: 'PastorPage', pathMatch: 'full'}
]