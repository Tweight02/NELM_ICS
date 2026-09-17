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
   * PREPARE PARTICULARS FOR A PROGRAM
   * ============================================================
   *
   * Works for BOTH parent and child programs.
   *
   * Converts the raw quarter items for the current year into
   * numbers (q1-q4) and precomputes the annual `total` ONCE,
   * instead of recalculating it inside the HTML template on
   * every change-detection pass.
   *
   * If a program has no `particulars` (e.g. a parent that is
   * purely a section header with no report values of its own),
   * this simply returns an empty array.
   */
  private mapParticulars(program: Program): ReportParticular[] {

    const year = new Date().getFullYear();

    const valueFor = (
      particular: Particular,
      quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4'
    ): number =>
      Number(
        particular.items?.find(
          item =>
            item.quarter === quarter &&
            Number(item.year) === year
        )?.particulars_value ?? 0
      );

    return (program.particulars ?? []).map((particular) => {

      const q1 = valueFor(particular, 'Q1');
      const q2 = valueFor(particular, 'Q2');
      const q3 = valueFor(particular, 'Q3');
      const q4 = valueFor(particular, 'Q4');

      return {
        ...particular,

        q1,
        q2,
        q3,
        q4,

        // ANNUAL TOTAL
        //
        // Calculated once here instead of repeatedly inside
        // the HTML template.
        total: q1 + q2 + q3 + q4
      };
    });
  }

  /**
   * ============================================================
   * LOAD REPORT PROGRAMS
   * ============================================================
   */
  private loadPrograms() {

    // ----------------------------------------------------------
    // 1. START LOADING STATE
    // ----------------------------------------------------------
    this.loading = true;


    // ----------------------------------------------------------
    // 2. CLEAR PREVIOUS ERROR
    // ----------------------------------------------------------
    this.error = null;


    // ----------------------------------------------------------
    // 3. REQUEST DATA FROM LARAVEL
    // ----------------------------------------------------------
    this.reportService.getProgram().subscribe({

      // ========================================================
      // SUCCESS
      // ========================================================
      next: (data) => {

        // ------------------------------------------------------
        // 4. SAVE DEPARTMENT DATA
        // ------------------------------------------------------
        this.department = data as Department;


        // ------------------------------------------------------
        // 5. GET PARENT PROGRAMS
        // ------------------------------------------------------
        const parentPrograms = this.department.programs ?? [];


        // ------------------------------------------------------
        // 6. RESET THE DISPLAY ARRAY
        // ------------------------------------------------------
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
          // Parent programs now carry their OWN particulars too
          // (via mapParticulars), in addition to being displayed
          // as section headers. If a parent has no particulars
          // of its own, mapParticulars simply returns [].
          //
          // NOTE: `...parent` also spreads `children` onto this
          // object, so each pushed parent still carries its full
          // subtree. That's unchanged from before; drop it here
          // with a destructure if it ever becomes a problem:
          //
          //     const { children, ...parentFields } = parent;
          //
          this.programs.push({
            ...parent,
            particulars: this.mapParticulars(parent)
          } as ReportProgram);


          // ====================================================
          // 9. LOOP THROUGH CHILD PROGRAMS
          // ====================================================
          //
          for (const child of parent.children ?? []) {


            // --------------------------------------------------
            // 10. ADD CHILD PROGRAM TO DISPLAY ARRAY
            // --------------------------------------------------
            //
            this.programs.push({
              ...child,
              particulars: this.mapParticulars(child)
            } as ReportProgram);
          }
        }


        // ------------------------------------------------------
        // 11. FINISH LOADING
        // ------------------------------------------------------
        //
        // This tells the HTML:
        //
        // "The API request and data preparation are finished."
        //
        this.loading = false;

        this.cdr.markForCheck();
      },


      // ========================================================
      // API ERROR
      // ========================================================
      error: (err) => {

        console.error('Failed to load programs:', err);


        // ------------------------------------------------------
        // 12. CREATE USER-FRIENDLY ERROR MESSAGE
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
        // 13. STOP LOADING STATE
        // ------------------------------------------------------
        //
        // IMPORTANT:
        // If you forget this, the loading/skeleton UI can stay
        // visible forever after an API error.
        //
        this.loading = false;


        // ------------------------------------------------------
        // 14. REFRESH ERROR UI
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