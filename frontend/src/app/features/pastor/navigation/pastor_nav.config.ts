import { NavItem } from "../../../core/models/navigation/nav-item.model";

export const pastor_nav_items: NavItem[] = [
    { label: 'Dashboard', path: '/pastor/home', icon: 'fa-house', roles: ['pastor'] },
    { label: 'Field Report', path: '/pastor/field-report', icon: 'fa-file-lines', roles: ['pastor'] },
    { label: 'Report Histroy', path: '/pastor/report-history', icon: 'fa-clipboard-list', roles: ['pastor']},
    { label: 'Church Report', path: '/pastor/church-report', icon: 'fa-church', roles: ['pastor'] },
    { label: 'Calendar', path: '/pastor/calendar', icon: 'fa-calendar', roles: ['pastor']},
    { label: 'Announcements', path: '/pastor/announcement', icon: 'fa-bullhorn', roles: ['pastor']},
];