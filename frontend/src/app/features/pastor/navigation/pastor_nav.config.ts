import { NavItem } from "../../../core/models/navigation/nav-item.model";

export const pastor_nav_items: NavItem[] = [
    { label: 'Home', path: '/pastor/home', icon: 'home', roles: ['pastor'] },
    { label: 'Field Report', path: '/pastor/field-report', icon: 'file-text', roles: ['pastor'] },
];