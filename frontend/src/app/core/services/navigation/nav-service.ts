import { Injectable, computed, inject } from '@angular/core';

import { pastor_nav_items } from '../../../features/pastor/navigation/pastor_nav.config';
import { AuthService } from '../auth/auth';

@Injectable({ providedIn: 'root' })
export class NavigationService {
    private auth = inject(AuthService);

    readonly navItems = computed(() => {
        const role = this.auth.currentUser()?.role;
        return pastor_nav_items.filter(item => item.roles.includes(role ?? ''));
    });
}
