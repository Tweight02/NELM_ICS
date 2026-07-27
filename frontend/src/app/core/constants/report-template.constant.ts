import { ReportSection } from '../models/table/table.model';

export const DEPARTMENTS = ['Pastoral (District)', 'Finance', 'Youth Ministries'];

export const ACCENT: Record<string, string> = {
    'Pastoral (District)': 'border-amber-600 bg-amber-50 text-amber-900',
    'Finance': 'border-teal-600 bg-teal-50 text-teal-900',
    'Youth Ministries': 'border-rose-600 bg-rose-50 text-rose-900',
};

export const TEMPLATES: Record<string, ReportSection[]> = {
    'Pastoral (District)': [
        {
            name: 'Demographic profile', rows: [
                { id: 'r1', label: 'No. of organized churches', rowNumber: 1, hasTotal: true },
                { id: 'r2', label: 'Total church membership', rowNumber: 2, hasTotal: true },
                { id: 'r3', label: 'Attendance on 2nd Sabbath', rowNumber: 3, hasTotal: false },
            ]
        },
        {
            name: 'Goals and achievements', rows: [
                { id: 'r4', label: 'New church planted', rowNumber: 4, hasTotal: true },
                { id: 'r5', label: 'No. of baptisms achieved', rowNumber: 5, hasTotal: true },
            ]
        },
    ],
    'Finance': [
        {
            name: 'Income', rows: [
                { id: 'f1', label: 'Tithe collected', rowNumber: 1, hasTotal: true },
                { id: 'f2', label: 'Offerings collected', rowNumber: 2, hasTotal: true },
            ]
        },
        {
            name: 'Status', rows: [
                { id: 'f3', label: 'Audit completed', rowNumber: 3, hasTotal: false },
            ]
        },
    ],
    'Youth Ministries': [
        {
            name: 'Membership', rows: [
                { id: 'y1', label: 'No. of active youth members', rowNumber: 1, hasTotal: true },
            ]
        },
    ],
};