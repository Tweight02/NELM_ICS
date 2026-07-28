import { Injectable, computed, inject } from '@angular/core';

import { pastor_nav_items } from '../../../features/pastor/navigation/pastor_nav.config';
import { secretary_nav_items } from '../../../features/secretary/navigation/secretary_nav.config';
import { AuthService } from '../auth/auth';

const PORTAL_LABELS: Record<string, string> = {
    pastor: 'District Pastor Portal',
    secretary: 'Secretary Portal',
    director: 'Director Portal',
    admin: 'Administrator Portal',
};

const NAVIGATION_MAP: Record<string, any[]> = {
    pastor: pastor_nav_items,
    secretary: secretary_nav_items,
};

@Injectable({ providedIn: 'root' })
export class NavigationService {
    private auth = inject(AuthService);

    readonly navItems = computed(() => {
    const role = this.auth.currentUser()?.role ?? '';

    return NAVIGATION_MAP[role] ?? [];
    });

    readonly portalLabel = computed(() => {
    const role = this.auth.currentUser()?.role;
    return PORTAL_LABELS[role ?? ''] ?? 'Portal';
    });
}
