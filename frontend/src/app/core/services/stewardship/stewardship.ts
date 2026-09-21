// core/services/reports/stewardship-service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Particular } from '../../models/reports/particular.model';

export interface StewardshipResponse {
    program_id: number;
    year: number;
    particulars: Particular[];
}

@Injectable({ providedIn: 'root' })
export class Stewardship {
    private apiUrl = environment.churchApiUrl;

    constructor(private http: HttpClient) {}

    getStewardship(): Observable<any> {
        return this.http.get<any>(
            `${this.apiUrl}church_representative/stewardship`,
            {
            withCredentials: true
            }
        );
    }
    
    saveMonthlyValues(data: any): Observable<any> {
        return this.http.post<any>(
            `${this.apiUrl}church_representative/stewardship/monthly-values`,
            data,
            {
            withCredentials: true
            }
        );
    }
}