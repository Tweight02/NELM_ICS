import { Injectable, computed, inject } from '@angular/core';

import { pastor_nav_items } from '../../../features/pastor/navigation/pastor_nav.config';
import { secretary_nav_items } from '../../../features/secretary/navigation/secretary_nav.config';
import { AuthService } from '../auth/auth';
import { church_rep_nav_items } from '../../../features/church_rep/navigation/church_nav.config';
import { NavItem } from '../../models/navigation/nav-item.model';

const PORTAL_LABELS: Record<string, string> = {
    pastor: 'District Pastor Portal',
    secretary: 'Administrative Secretary Portal',
    director: 'Administrative Director Portal',
    admin: 'Administrator Portal',
    church_representative: 'Church Representative Portal',
};

const NAVIGATION_MAP: Record<string, NavItem[]> = {
    pastor: pastor_nav_items,
    secretary: secretary_nav_items,
    church_representative: church_rep_nav_items
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
