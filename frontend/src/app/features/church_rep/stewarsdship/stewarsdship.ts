import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { AuthService } from '../../../core/services/auth/auth';
import { Particular } from '../../../core/models/reports/particular.model';
import { Stewardship } from '../../../core/services/stewardship/stewardship';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../../core/services/reports/report-service';

@Component({
  selector: 'app-stewarsdship',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stewarsdship.html',
  styleUrl: './stewarsdship.css',
})
export class Stewarsdship implements OnInit {

  particulars: Particular[] = [];

  loading = true;

  error: string | null = null;

  selectedQuarter: 'Quarter1' | 'Quarter2' | 'Quarter3' | 'Quarter4' = 'Quarter1';

  selectedYear = 2026;

  monthlyValues: {
    [particularId: number]: {
      [month: string]: number;
    };
  } = {};

  reportValues: {
    [particularId: number]: number;
  } = {};
  quarterlyTotals: { [particularId: number]: number } = {};

  constructor(
    public authService: AuthService,
    private stewardshipService: Stewardship,
    private cdr: ChangeDetectorRef,
    public reportService: ReportService
  ) { }

  ngOnInit(): void {
    this.loadParticulars();
  }

  loadParticulars(): void {
    this.loading = true;
    this.error = null;
    this.stewardshipService.getStewardship().subscribe({
      next: (data) => {
        this.particulars = data.particulars ?? [];
        // Initialize monthly values separately
        // for every stewardship particular.
        this.particulars.forEach(particular => {
          if (
            particular.particular_id === 47 ||
            particular.particular_id === 48
          ) {
            this.monthlyValues[particular.particular_id] = {};
          }
        });
        this.loading = false;
        this.cdr.detectChanges();
        console.log(
          'Stewardship particulars:',
          this.particulars
        );
        console.log(
          'Monthly values:',
          this.monthlyValues
        );
      },
      error: (err) => {
        console.error(
          'Failed to load stewardship data:',
          err
        );
        this.error =
          err?.error?.message ??
          'Unable to load stewardship data.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getMonthsForQuarter(): string[] {
    const monthsByQuarter: Record<
      'Quarter1' | 'Quarter2' | 'Quarter3' | 'Quarter4',
      string[]
    > = {
      Quarter1: [
        'January',
        'February',
        'March'
      ],
      Quarter2: [
        'April',
        'May',
        'June'
      ],
      Quarter3: [
        'July',
        'August',
        'September'
      ],
      Quarter4: [
        'October',
        'November',
        'December'
      ]
    };

    return monthsByQuarter[this.selectedQuarter];
  }

  saveMonthlyValues(particularId: number): void {

    const months = this.getMonthsForQuarter();

    if (!this.monthlyValues[particularId]) {
      this.monthlyValues[particularId] = {};
    }

    const monthlyValues: { [month: string]: number } = {};

    months.forEach(month => {

      monthlyValues[month] = Number(
        this.monthlyValues[particularId]?.[month] ?? 0
      );

    });

    const total = months.reduce(
      (sum, month) => sum + monthlyValues[month],
      0
    );

    // Store the quarterly total separately
    this.quarterlyTotals[particularId] = total;

    const data = {
      particular_id: particularId,
      quarter: this.selectedQuarter,
      year: this.selectedYear,
      monthly_values: monthlyValues,
      particulars_value: total
    };

    console.log('Saving stewardship:', data);

    this.stewardshipService.saveMonthlyValues(data).subscribe({

      next: (response) => {

        console.log(
          'Stewardship saved successfully:',
          response
        );

        this.cdr.detectChanges();

      },

      error: (err) => {

        console.error(
          'Failed to save stewardship:',
          err
        );

        this.error =
          err?.error?.message ??
          'Unable to save stewardship values.';

        this.cdr.detectChanges();

      }

    });
  }

  saveReportValue(particularId: number): void {
    const value = Number(this.reportValues[particularId] ?? 0);

    const data = {
      particular_id: particularId,
      quarter: this.selectedQuarter,
      year: this.selectedYear,
      particulars_value: value
    };

    console.log('Saving report value:', data);

    this.reportService.saveParticularValue(data).subscribe({
      next: (response) => {
        console.log('Report value saved successfully:', response);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to save report value:', err);

        this.error =
          err?.error?.message ??
          'Unable to save report value.';

        this.cdr.detectChanges();
      }
    });
  }
}