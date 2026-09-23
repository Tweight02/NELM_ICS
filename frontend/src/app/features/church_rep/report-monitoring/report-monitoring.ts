import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-report-monitoring',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report-monitoring.html'
})
export class ReportMonitoringComponent implements OnInit {

  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  report: any = null;
  loading = true;
  errorMessage = '';

  year = new Date().getFullYear();

  apiUrl = 'http://api.icsnelm.test:8002/api';

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport(): void {
    this.loading = true;
    this.errorMessage = '';

    const departmentId = Number(
      this.route.snapshot.paramMap.get('departmentId')
    );

    console.log('Department ID:', departmentId);

    if (!departmentId || departmentId <= 0) {
      this.errorMessage =
        'Invalid department ID. Please select a department again.';

      this.loading = false;

      this.cdr.detectChanges();

      return;
    }

    this.http.get<any>(
      `${this.apiUrl}/church_representative/monitoring/${departmentId}?year=${this.year}`,
      { withCredentials: true }
    ).subscribe({

      next: (response) => {

        console.log('Department report:', response);
        console.log('Programs:', response?.programs);
        console.log('Program count:', response?.programs?.length);

        // Assign response
        this.report = response;

        // Stop loading
        this.loading = false;

        // Force Angular to immediately update the template
        this.cdr.detectChanges();

        console.log('Report assigned:', this.report);
      },

      error: (error) => {

        console.error(
          'Failed to load department report:',
          error
        );

        this.errorMessage =
          error?.error?.message ??
          'Unable to load department report.';

        this.loading = false;

        // Force UI update even when request fails
        this.cdr.detectChanges();
      }
    });
  }

  getNumberValue(value: any): string {
    if (value === null || value === undefined || value === '') {
      return '-';
    }

    const numberValue = Number(value);

    if (!Number.isFinite(numberValue) || numberValue === 0) {
      return '-';
    }

    return numberValue.toLocaleString('en-US', {
      maximumFractionDigits: 0
    });
  }

  getMoneyValue(value: any): string {
    if (value === null || value === undefined || value === '') {
      return '-';
    }

    const numberValue = Number(value);

    if (!Number.isFinite(numberValue) || numberValue === 0) {
      return '-';
    }

    return numberValue.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  getQuarterValue(
    particular: any,
    quarter: 'Quarter1' | 'Quarter2' | 'Quarter3' | 'Quarter4'
  ): string {

    const quarterData = particular?.quarters?.[quarter];

    if (
      quarterData === null ||
      quarterData === undefined
    ) {
      return '-';
    }

    let value: any;

    if (
      typeof quarterData === 'object' &&
      'value' in quarterData
    ) {
      value = quarterData.value;
    } else {
      value = quarterData;
    }

    if (particular?.is_money === true) {
      return this.getMoneyValue(value);
    }

    return this.getNumberValue(value);
  }

  getMonthlyValue(
    particular: any,
    month: string
  ): string {

    const value = particular?.monthly?.[month];

    if (particular?.is_money === true) {
      return this.getMoneyValue(value);
    }

    return this.getNumberValue(value);
  }

  getParticularTotal(particular: any): string {

    const isMoney = particular?.is_money === true;

    // Money particulars use monthly values
    if (particular?.monthly) {

      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ];

      let total = 0;
      let hasValue = false;

      for (const month of months) {

        const value = Number(
          particular.monthly[month]
        );

        if (
          Number.isFinite(value) &&
          value !== 0
        ) {
          total += value;
          hasValue = true;
        }
      }

      if (!hasValue) {
        return '-';
      }

      return isMoney
        ? this.getMoneyValue(total)
        : this.getNumberValue(total);
    }

    // Regular particulars use quarterly values
    const quarters = [
      'Quarter1',
      'Quarter2',
      'Quarter3',
      'Quarter4'
    ] as const;

    let total = 0;
    let hasValue = false;

    for (const quarter of quarters) {

      const quarterData =
        particular?.quarters?.[quarter];

      let value: any;

      if (
        quarterData &&
        typeof quarterData === 'object' &&
        'value' in quarterData
      ) {
        value = quarterData.value;
      } else {
        value = quarterData;
      }

      const numberValue = Number(value);

      if (
        Number.isFinite(numberValue) &&
        numberValue !== 0
      ) {
        total += numberValue;
        hasValue = true;
      }
    }

    if (!hasValue) {
      return '-';
    }

    return isMoney
      ? this.getMoneyValue(total)
      : this.getNumberValue(total);
  }
}