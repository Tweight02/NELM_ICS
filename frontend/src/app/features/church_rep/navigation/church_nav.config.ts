import { NavItem } from "../../../core/models/navigation/nav-item.model";

export const church_rep_nav_items: NavItem[] = [
    { label: 'Report', path: '/church_rep/home', icon: 'fa-clipboard-list', roles: ['church_representative'], hiddenForDepartments: [2,4] },
    { label: 'Monitoring', path: '/church_rep/monitoring', icon: 'fa-clipboard-list', roles: ['church_representative'], departmentId: 4 },
    { label: 'Stewardship', path: '/church_rep/stewardship', icon: 'fa-house', roles: ['church_representative'], departmentId: 2},
    {label: 'Manage Roles', path: '/church_rep/manage-roles', icon: 'fa-users-gear', roles: ['church_representative'], departmentId: 4},
    { label: 'Event', path: '/church_rep/event', icon: 'fa-calendar', roles: ['church_representative']},
    { label: 'Announcements', path: '/church_rep/announcement', icon: 'fa-bell', roles: ['church_representative']},
];