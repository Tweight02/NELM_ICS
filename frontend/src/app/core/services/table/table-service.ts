import { Injectable } from '@angular/core';
import { ReportValue } from '../../models/table/table.model'

@Injectable({ providedIn: 'root' })
export class TableService {
    // Temporary in-memory store — replace with HttpClient calls to your real API
    private values: ReportValue[] = [];

    getValuesByRow(departmentId: string, submittedBy: string): Record<string, number[]> {
        const result: Record<string, number[]> = {};
        this.values
            .filter(v => v.departmentId === departmentId && v.submittedBy === submittedBy)
            .forEach(v => {
                if (!result[v.rowId]) result[v.rowId] = [0, 0, 0, 0];
                result[v.rowId][v.quarter] = v.value;
            });
        return result;
    }

    getCombinedValuesByRow(departmentId: string): Record<string, number[]> {
        const result: Record<string, number[]> = {};
        this.values
            .filter(v => v.departmentId === departmentId)
            .forEach(v => {
                if (!result[v.rowId]) result[v.rowId] = [0, 0, 0, 0];
                result[v.rowId][v.quarter] += v.value; // sum across pastors
            });
        return result;
    }

    saveValues(departmentId: string, submittedBy: string, valuesByRow: Record<string, number[]>) {
        // Remove this pastor's old entries for this department, then re-insert fresh ones
        this.values = this.values.filter(
            v => !(v.departmentId === departmentId && v.submittedBy === submittedBy)
        );
        Object.entries(valuesByRow).forEach(([rowId, quarters]) => {
            quarters.forEach((value, quarter) => {
                this.values.push({ rowId, quarter, value, departmentId, submittedBy });
            });
        });
        // Replace with: return this.http.post('/api/report-values', {...})
        return Promise.resolve();
    }
}
