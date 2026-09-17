import { NavItem } from "../../../core/models/navigation/nav-item.model";

export const church_rep_nav_items: NavItem[] = [
    { label: 'Report', path: '/church_rep/home', icon: 'fa-clipboard-list', roles: ['church_representative'] },
    { label: 'Event', path: '/church_rep/event', icon: 'fa-calendar', roles: ['church_representative']},
    { label: 'Stewardship', path: '/church_rep/stewardship', icon: 'fa-house', roles: ['church_representative']},
    { label: 'Announcements', path: '/church_rep/announcement', icon: 'fa-bell', roles: ['church_representative']},
];