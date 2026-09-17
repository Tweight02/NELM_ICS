export interface ParticularItem {
    particular_id: number;
    church_id: number;
    quarter: string;
    year: number;
    particulars_value: number;
    status: string;
    date_submitted: string;
    date_approved: string | null;
    submitted_by: string;
    endorsed_by: string | null;
    approved_by: string | null;
}