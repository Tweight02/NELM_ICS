import { ParticularItem } from "./particular_item.model";

export interface Particular {
    particular_id: number;
    program_id: number;
    particular_name: string;
    q1?: number | null;
    q2?: number | null;
    q3?: number | null;
    q4?: number | null;
    total?: number;

    items?: ParticularItem[];
}