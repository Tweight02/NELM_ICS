import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../core/services/auth/auth';
import {
  ReportService,
  Program
} from '../../../core/services/reports/report-service';

import { Department } from '../../../core/models/reports/department.model';
import { Particular } from '../../../core/models/reports/particular.model';
import { FormsModule } from '@angular/forms';

interface ReportParticular extends Particular {
  total: number;
}

interface ReportProgram extends Program {
  particulars: ReportParticular[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home implements OnInit {

  department: Department | null = null;
  programs: ReportProgram[] = [];

  selectedQuarter: 'annual' | 'Quarter1' | 'Quarter2' | 'Quarter3' | 'Quarter4' = 'annual';

  loading = true;
  error: string | null = null;

  constructor(
    public authService: AuthService,
    private reportService: ReportService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadPrograms();
  }

  /**
   * ============================================================
   * LOAD REPORT PROGRAMS
   * ============================================================
   *
   * PURPOSE:
   * Loads the department's programs and their report particulars
   * from the Laravel API, then prepares the data for the table.
   *
   * DATA FLOW:
   *
   * Laravel API
   *    ↓
   * Department
   *    ↓
   * Parent Programs
   *    ↓
   * Child Programs
   *    ↓
   * Particulars
   *    ↓
   * Angular Report Table
   *
   *
   * IMPORTANT:
   * - This method runs when the Home page opens.
   * - The API request is made through ReportService.
   * - Annual totals are calculated ONCE here.
   * - The HTML should only DISPLAY the prepared values.
   *
   * ============================================================
   */
  private loadPrograms() {

    // ----------------------------------------------------------
    // 1. START LOADING STATE
    // ----------------------------------------------------------
    //
    // loading = true tells the HTML to show the loading UI.
    //
    // If you change the loading design (spinner/skeleton/etc.),
    // you normally DON'T need to change this line.
    //
    this.loading = true;


    // ----------------------------------------------------------
    // 2. CLEAR PREVIOUS ERROR
    // ----------------------------------------------------------
    //
    // If a previous API request failed, remove that error before
    // starting a new request.
    //
    this.error = null;


    // ----------------------------------------------------------
    // 3. REQUEST DATA FROM LARAVEL
    // ----------------------------------------------------------
    //
    // IMPORTANT:
    // If the report is taking a long time to load, this is one
    // of the FIRST places to investigate.
    //
    // The actual API request is inside:
    //
    //     reportService.getProgram()
    //
    // DO NOT put database queries here.
    // Database optimization belongs in Laravel.
    //
    this.reportService.getProgram().subscribe({

      // ========================================================
      // SUCCESS
      // ========================================================
      next: (data) => {

        // ------------------------------------------------------
        // 4. SAVE DEPARTMENT DATA
        // ------------------------------------------------------
        //
        // Laravel returns something similar to:
        //
        // department
        //   └── programs
        //         └── children
        //               └── particulars
        //
        // We save the complete department response here.
        //
        this.department = data as Department;


        // ------------------------------------------------------
        // 5. GET PARENT PROGRAMS
        // ------------------------------------------------------
        //
        // `programs` contains the top-level programs returned
        // by Laravel.
        //
        // `?? []` prevents an error if Laravel returns null.
        //
        // Example:
        //
        // programs:
        //   - Administration
        //   - Evangelism
        //   - Youth Ministry
        //
        const parentPrograms = this.department.programs ?? [];


        // ------------------------------------------------------
        // 6. RESET THE DISPLAY ARRAY
        // ------------------------------------------------------
        //
        // `this.programs` is the array actually used by the
        // HTML table.
        //
        // We rebuild it from the API response.
        //
        this.programs = [];


        // ======================================================
        // 7. LOOP THROUGH PARENT PROGRAMS
        // ======================================================
        //
        // Each parent program becomes a heading/section in
        // the report.
        //
        for (const parent of parentPrograms) {


          // ----------------------------------------------------
          // 8. ADD PARENT PROGRAM
          // ----------------------------------------------------
          //
          // Parent programs are displayed as section headers.
          //
          // We intentionally give them an empty `particulars`
          // array because the current report structure displays
          // the CHILD programs' particulars.
          //
          // IMPORTANT:
          // If your business logic changes and parent programs
          // should also contain report values, this is one of
          // the places you will need to modify.
          //
          this.programs.push({
            ...parent,
            particulars: []
          } as ReportProgram);


          // ====================================================
          // 9. LOOP THROUGH CHILD PROGRAMS
          // ====================================================
          //
          // A parent may have multiple child programs.
          //
          // Example:
          //
          // Youth Ministry
          //   ├── Bible Study
          //   ├── Outreach
          //   └── Fellowship
          //
          for (const child of parent.children ?? []) {


            // --------------------------------------------------
            // 10. PREPARE PARTICULARS
            // --------------------------------------------------
            //
            // This is where we prepare the actual report rows.
            //
            // Instead of calculating the Annual Total inside
            // the HTML every time Angular checks the page,
            // we calculate it ONCE here.
            //
            const particulars: ReportParticular[] =
              (child.particulars ?? []).map((particular) => {


                // ----------------------------------------------
                // 11. CONVERT QUARTER VALUES TO NUMBERS
                // ----------------------------------------------
                //
                // Laravel/database values may arrive as strings.
                //
                // Example:
                //
                // q1 = "100"
                //
                // Number("100") = 100
                //
                // `?? 0` makes missing values zero.
                //
                const q1 = Number(
                  particular.items?.find(
                    item =>
                      item.quarter === 'Q1' &&
                      Number(item.year) === new Date().getFullYear()
                  )?.particulars_value ?? 0
                );

                const q2 = Number(
                  particular.items?.find(
                    item =>
                      item.quarter === 'Q2' &&
                      Number(item.year) === new Date().getFullYear()
                  )?.particulars_value ?? 0
                );

                const q3 = Number(
                  particular.items?.find(
                    item =>
                      item.quarter === 'Q3' &&
                      Number(item.year) === new Date().getFullYear()
                  )?.particulars_value ?? 0
                );

                const q4 = Number(
                  particular.items?.find(
                    item =>
                      item.quarter === 'Q4' &&
                      Number(item.year) === new Date().getFullYear()
                  )?.particulars_value ?? 0
                );


                // ----------------------------------------------
                // 12. RETURN PREPARED PARTICULAR
                // ----------------------------------------------
                //
                // We keep all original particular properties
                // using:
                //
                //     ...particular
                //
                // Then we overwrite q1-q4 with real numbers and
                // add a frontend-only `total`.
                //
                // Example:
                //
                // q1 = 100
                // q2 = 200
                // q3 = 150
                // q4 = 50
                //
                // total = 500
                //
                return {
                  ...particular,

                  q1,
                  q2,
                  q3,
                  q4,

                  // ANNUAL TOTAL
                  //
                  // Calculated once here instead of repeatedly
                  // inside the HTML template.
                  total: q1 + q2 + q3 + q4
                };
              });


            // --------------------------------------------------
            // 13. ADD CHILD PROGRAM TO DISPLAY ARRAY
            // --------------------------------------------------
            //
            // At this point the child program has:
            //
            // child
            //   └── particulars
            //         ├── q1
            //         ├── q2
            //         ├── q3
            //         ├── q4
            //         └── total
            //
            this.programs.push({
              ...child,
              particulars
            } as ReportProgram);
          }
        }


        // ------------------------------------------------------
        // 14. FINISH LOADING
        // ------------------------------------------------------
        //
        // This tells the HTML:
        //
        // "The API request and data preparation are finished."
        //
        this.loading = false;


        // ------------------------------------------------------
        // 15. TELL ANGULAR TO UPDATE THE SCREEN
        // ------------------------------------------------------
        //
        // Required because we're using OnPush change detection.
        //
        // Without this, Angular may not immediately refresh the
        // screen after the API response.
        //
        this.cdr.markForCheck();
      },


      // ========================================================
      // API ERROR
      // ========================================================
      error: (err) => {

        // ------------------------------------------------------
        // 16. LOG ERROR FOR DEVELOPERS
        // ------------------------------------------------------
        //
        // Open browser DevTools → Console to see the actual
        // error.
        //
        console.error('Failed to load programs:', err);


        // ------------------------------------------------------
        // 17. CREATE USER-FRIENDLY ERROR MESSAGE
        // ------------------------------------------------------
        //
        // Prefer Laravel's error message if one exists.
        //
        // Otherwise display a generic message.
        //
        this.error =
          err?.error?.message ??
          'Failed to load department data.';


        // ------------------------------------------------------
        // 18. STOP LOADING STATE
        // ------------------------------------------------------
        //
        // IMPORTANT:
        // If you forget this, the loading/skeleton UI can stay
        // visible forever after an API error.
        //
        this.loading = false;


        // ------------------------------------------------------
        // 19. REFRESH ERROR UI
        // ------------------------------------------------------
        //
        // Tell Angular to display the error message.
        //
        this.cdr.markForCheck();
      }
    });
  }

  setQuarter(
    quarter: 'annual' | 'Quarter1' | 'Quarter2' | 'Quarter3' | 'Quarter4'
  ): void {
    this.selectedQuarter = quarter;
  }

  getValue(particular: ReportParticular): number {

    switch (this.selectedQuarter) {
      case 'Quarter1':
        return particular.q1 ?? 0;

      case 'Quarter2':
        return particular.q2 ?? 0;

      case 'Quarter3':
        return particular.q3 ?? 0;

      case 'Quarter4':
        return particular.q4 ?? 0;

      default:
        return particular.total;
    }
  }

  getQuarterLabel(): string {
    return this.selectedQuarter === 'annual'
      ? 'Annual Summary'
      : `${this.selectedQuarter} Report`;
  }

  getTotal(particular: Particular): number {
      return (
          (particular.q1 ?? 0) +
          (particular.q2 ?? 0) +
          (particular.q3 ?? 0) +
          (particular.q4 ?? 0)
      );
  }

  getQuarterValue(particular: Particular): number {
      if (this.selectedQuarter === 'annual') {
          return 0;
      }

      const quarter = this.selectedQuarter.toLowerCase() as
          'q1' | 'q2' | 'q3' | 'q4';

      return particular[quarter] ?? 0;
  }

  setQuarterValue(
      particular: Particular,
      value: number | string
  ): void {
      if (this.selectedQuarter === 'annual') {
          return;
      }

      const quarter = this.selectedQuarter.toLowerCase() as
          'q1' | 'q2' | 'q3' | 'q4';

      particular[quarter] = Number(value) || 0;

      // Update annual total immediately in the UI
      particular.total = this.getTotal(particular);
  }

  saveValue(
      particular: Particular,
      quarter: 'Quarter1' | 'Quarter2' | 'Quarter3' | 'Quarter4'
  ){

      const quarterKey = quarter.toLowerCase() as
          'q1' | 'q2' | 'q3' | 'q4';

      const value = Number(particular[quarterKey] ?? 0);

      this.reportService.saveParticularValue({
          particular_id: particular.particular_id,
          quarter: quarter,
          year: new Date().getFullYear(),
          particulars_value: value
      }).subscribe({
          next: () => {
              console.log(
                  `Saved ${quarter} value for particular ${particular.particular_id}`
              );
          },
          error: (err) => {
              console.error('Failed to save report value:', err);
          }
      });
  }
}