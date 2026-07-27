export interface ReportRow {
    id: string;
    label: string;
    rowNumber: number;
    hasTotal: boolean;
}

export interface ReportSection {
    name: string;
    rows: ReportRow[];
}

export interface ReportValue {
    rowId: string;
    quarter: number; // 0-3
    value: number;
    departmentId: string;
    submittedBy: string;
}