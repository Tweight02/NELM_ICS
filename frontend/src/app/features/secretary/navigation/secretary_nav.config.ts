import { NavItem } from "../../../core/models/navigation/nav-item.model";

export const secretary_nav_items: NavItem[] = [
    { label: 'Dashboard', path: '/secretary/home', icon: 'fa-house', roles: ['secretary'] },
    { label: 'Check Report', path: '/secretary/check-report-completenes', icon: 'fa-church', roles: ['secretary'] },
    { label: 'Assist Communications', path: '/secretary/assist-communication', icon: 'fa-church', roles: ['secretary'] },
    { label: 'Manage Records', path: '/secretary/manage-record-files', icon: 'fa-church', roles: ['secretary'] },
    { label: 'Reports', path: '/secretary/reports', icon: 'fa-calendar', roles: ['secretary']},
];