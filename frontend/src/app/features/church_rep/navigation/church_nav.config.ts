import { NavItem } from "../../../core/models/navigation/nav-item.model";

export const church_rep_nav_items: NavItem[] = [
    { label: 'Dashboard', path: '/church_rep/home', icon: 'fa-house', roles: ['church_rep'] },
    { label: 'Report', path: '/church_rep/report', icon: 'fa-clipboard-list', roles: ['church_rep']},
    { label: 'Event', path: '/church_rep/event', icon: 'fa-calendar', roles: ['church_rep']},
    { label: 'Notification', path: '/church_rep/notification', icon: 'fa-bell', roles: ['church_rep']},

];