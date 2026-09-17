import { Program } from "../../services/reports/report-service";

export interface Department {
    department_id: number;
    department_name: string;
    church_id: number;
    programs: Program[];
}