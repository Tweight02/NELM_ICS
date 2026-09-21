export interface NavItem {
    label: string;
    path: string;
    icon: string;
    roles: string[];
    departmentId?: number;
    hiddenForDepartments?: number[];
}