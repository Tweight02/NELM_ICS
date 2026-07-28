export interface ChurchReportEntry {
    id: string;
    church: string;
    department: string;
    program: string;
    date: string;      // ISO string, e.g. '2026-05-12'
    submittedBy: string;
}