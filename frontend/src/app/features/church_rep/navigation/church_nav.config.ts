import { NavItem } from "../../../core/models/navigation/nav-item.model";

export const church_rep_nav_items: NavItem[] = [
    { label: 'Dashboard', path: '/church_rep/home', icon: 'fa-house', roles: ['church_rep'] },
    { label: 'Field Report', path: '/church_rep/field-reports', icon: 'fa-clipboard-list', roles: ['church_rep']},
    { label: 'Church Report', path: '/church_rep/church-report', icon: 'fa-church', roles: ['church_rep'] },
    { label: 'Calendar', path: '/church_rep/calendar', icon: 'fa-calendar', roles: ['church_rep']},
];