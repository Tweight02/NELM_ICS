import { NavItem } from "../../../core/models/navigation/nav-item.model";

export const pastor_nav_items: NavItem[] = [
    { label: 'Dashboard', path: '/pastor/home', icon: 'fa-house', roles: ['pastor'] },
    { label: 'Field Report', path: '/pastor/field-reports', icon: 'fa-clipboard-list', roles: ['pastor']},
    { label: 'Report Summary', path: '/pastor/field-reports-edit', icon: 'fa-clipboard-list', roles: ['pastor']},
    { label: 'Church Report', path: '/pastor/church-report', icon: 'fa-church', roles: ['pastor'] },
    { label: 'Events', path: '/pastor/events', icon: 'fa-calendar', roles: ['pastor']},
];