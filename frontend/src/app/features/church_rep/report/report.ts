import {
    ChangeDetectorRef,
    Component,
    OnInit
} from '@angular/core';

import {
    CommonModule
} from '@angular/common';

import {
    RouterLink
} from '@angular/router';

import {
    FormsModule
} from '@angular/forms';

import {
    ReportService,
    DepartmentMonitoring,
    QuarterProgress
} from '../../../core/services/reports/report-service';


@Component({
    selector: 'app-report',
    standalone: true,

    imports: [
        CommonModule,
        FormsModule,
        RouterLink
    ],

    templateUrl: './report.html',

    styleUrl: './report.css',
})
export class Report implements OnInit {

    /*
    |--------------------------------------------------------------------------
    | State
    |--------------------------------------------------------------------------
    */

    year = 2026;

    departments: DepartmentMonitoring[] = [];

    loading = false;

    errorMessage = '';


    /*
    |--------------------------------------------------------------------------
    | Constructor
    |--------------------------------------------------------------------------
    */

    constructor(
        private reportService: ReportService,
        private cdr: ChangeDetectorRef
    ) {}


    /*
    |--------------------------------------------------------------------------
    | Initialize
    |--------------------------------------------------------------------------
    */

    ngOnInit(): void {

        this.loadMonitoring();

    }


    /*
    |--------------------------------------------------------------------------
    | Load Report Monitoring
    |--------------------------------------------------------------------------
    */

    loadMonitoring(): void {

        this.loading = true;

        this.errorMessage = '';

        /*
        |--------------------------------------------------------------------------
        | Immediately update loading state
        |--------------------------------------------------------------------------
        */

        this.cdr.detectChanges();


        this.reportService
            .getReportMonitoring(this.year)
            .subscribe({

                /*
                |--------------------------------------------------------------------------
                | Success
                |--------------------------------------------------------------------------
                */

                next: (response) => {

                    console.log(
                        'Report monitoring response:',
                        response
                    );


                    this.departments =
                        response.departments;


                    this.loading = false;


                    /*
                    |--------------------------------------------------------------------------
                    | Force Angular to update the UI
                    |--------------------------------------------------------------------------
                    */

                    this.cdr.detectChanges();

                },


                /*
                |--------------------------------------------------------------------------
                | Error
                |--------------------------------------------------------------------------
                */

                error: (error) => {

                    console.error(
                        'Error loading report monitoring:',
                        error
                    );


                    this.errorMessage =
                        'Unable to load report monitoring.';


                    this.loading = false;


                    /*
                    |--------------------------------------------------------------------------
                    | Force Angular to update the UI
                    |--------------------------------------------------------------------------
                    */

                    this.cdr.detectChanges();

                }

            });

    }


    /*
    |--------------------------------------------------------------------------
    | Get Quarter Progress
    |--------------------------------------------------------------------------
    */

    getProgress(
        department: DepartmentMonitoring,
        quarter:
            | 'Quarter1'
            | 'Quarter2'
            | 'Quarter3'
            | 'Quarter4'
    ): QuarterProgress {

        return department.quarters[quarter];

    }


    /*
    |--------------------------------------------------------------------------
    | Progress Bar Color
    |--------------------------------------------------------------------------
    */

    getProgressColor(
        percentage: number | null
    ): string {

        if (percentage === null) {

            return 'bg-gray-300';

        }


        if (percentage >= 80) {

            return 'bg-emerald-600';

        }


        if (percentage >= 50) {

            return 'bg-amber-500';

        }


        return 'bg-orange-500';

    }

}