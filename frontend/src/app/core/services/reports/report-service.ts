import { Injectable } from '@angular/core';

import {
    HttpClient,
    HttpHeaders
} from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { Particular } from '../../models/reports/particular.model';


/*
|--------------------------------------------------------------------------
| Program
|--------------------------------------------------------------------------
*/

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
    quarter:
        | 'Quarter1'
        | 'Quarter2'
        | 'Quarter3'
        | 'Quarter4';
    year: number;
    particulars_value: number;
}
export interface QuarterProgress {
    total: number;
    completed: number;
    percentage: number | null;
    has_report: boolean;
}
export interface ReportRepresentative {
    user_id: number;
    name: string;
    email: string;
}
export interface DepartmentMonitoring {
    department_id: number;
    department_name: string;
    representative:
        | ReportRepresentative
        | null;
    total_particulars: number;
    quarters: {
        Quarter1: QuarterProgress;
        Quarter2: QuarterProgress;
        Quarter3: QuarterProgress;
        Quarter4: QuarterProgress;
    };
}
export interface ReportMonitoringResponse {
    year: number;
    departments: DepartmentMonitoring[];
}
export interface DepartmentReport {
    year: number;
    department: {
        department_id: number;
        department_name: string;
    };
    representative:
        | ReportRepresentative
        | null;
    programs: ProgramReport[];
}


export interface ProgramReport {
    program_id: number;
    program_name: string;
    parent_id: number | null;
    particulars: ParticularReport[];
}


export interface ParticularReport {
    particular_id: number;
    particular_name: string;

    quarters: {
        Quarter1: {
            value: string | null;
        };
        Quarter2: {
            value: string | null;
        };
        Quarter3: {
            value: string | null;
        };
        Quarter4: {
            value: string | null;
        };
    };

    monthly?: {
        January: number;
        February: number;
        March: number;
        April: number;
        May: number;
        June: number;
        July: number;
        August: number;
        September: number;
        October: number;
        November: number;
        December: number;
    };
}
@Injectable({
    providedIn: 'root'
})
export class ReportService {

    private apiUrl =
        environment.churchApiUrl;


    httpOptions = {

        headers: new HttpHeaders({

            'Content-Type':
                'application/json',

        }),

        withCredentials: true,

    };


    constructor(
        private http: HttpClient
    ) { }


    /*
    |--------------------------------------------------------------------------
    | Existing Church Representative Report
    |--------------------------------------------------------------------------
    */

    getProgram() {

        return this.http.get(
            `${this.apiUrl}church_representative/home`
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Save Particular Value
    |--------------------------------------------------------------------------
    */

    saveParticularValue(
        data: SaveParticularValue
    ) {

        return this.http.post(

            `${this.apiUrl}church_representative/report-value`,

            data,

            this.httpOptions

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Report Monitoring
    |--------------------------------------------------------------------------
    */

    getReportMonitoring(
        year: number
    ): Observable<ReportMonitoringResponse> {

        return this.http.get<ReportMonitoringResponse>(

            `${this.apiUrl}church_representative/monitoring`,

            {

                params: {

                    year: year.toString()

                },

                withCredentials: true

            }

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Get Department Report
    |--------------------------------------------------------------------------
    */

    getDepartmentReport(

        departmentId: number,

        year: number

    ): Observable<DepartmentReport> {

        return this.http.get<DepartmentReport>(

            `${this.apiUrl}church_representative/monitoring/${departmentId}`,

            {

                params: {

                    year: year.toString()

                },

                withCredentials: true

            }

        );

    }

}