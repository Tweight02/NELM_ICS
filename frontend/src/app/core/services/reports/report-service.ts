import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Particular } from '../../models/reports/particular.model';

export interface Program {
    program_id: number;
    department_id: number;
    program_name: string;
    parent_id: number | null;
    children?: Program[];
    particulars?: Particular[];
}

export interface SaveParticularValue {
    particular_id: number;
    quarter: 'Quarter1' | 'Quarter2' | 'Quarter3' | 'Quarter4';
    year: number;
    particulars_value: number;
    }

@Injectable({ providedIn: 'root' })
export class ReportService {
    private apiUrl = environment.churchApiUrl;

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
        withCredentials: true,
    };

    constructor(private http: HttpClient) {}

    getProgram(){
        return this.http.get(
            `${this.apiUrl}church_representative/home`
        );
    }

  // Save a particular value
    saveParticularValue(data: SaveParticularValue) {
        return this.http.post(
        `${this.apiUrl}church_representative/report-value`,data , this.httpOptions);
    }
}