import { Department } from "./reports/department.model";

export interface User {
    id: number;
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
    birthdate: Date;
    gender: string;
    role: string;
    department_id: number;
    church_id: number;
    church?: {
        church_id: number;
        name: string;
        address?: string;
        parent_id?: number;
        district?: {
            church_id: number;
            name: string;
            address?: string;
            parent_id?: number;
        };
    };
    department?: Department;
}
