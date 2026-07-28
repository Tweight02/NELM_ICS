import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TEMPLATES, ACCENT } from '../../../core/constants/report-template.constant';
import { Table } from '../../../shared/components/table/table';
import { RouterLink } from '@angular/router';
import { TableService } from '../../../core/services/table/table-service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Table],
  templateUrl: './reports.html',
})
export class Reports implements OnInit {
  currentUser = {
    id: 'pastor-01',
    name: 'Pastor Reyes',
    role: 'pastor', // try 'director' to see the difference
    departmentId: 'Pastoral (District)',
  };
  // private auth = inject(AuthService);
  private reportService = inject(TableService);

  // currentUser = this.auth.currentUser; // adjust () if this is a signal

  // All departments available to filter by (comes from the template config)
  departments: string[] = Object.keys(TEMPLATES);

  // Defaults to the user's own department, but can be changed via the dropdown
  selectedDept: string = this.currentUser.departmentId;

  myValuesByRow: Record<string, number[]> = {};

  get template() {
    return TEMPLATES[this.selectedDept];
  }
  get accent() {
    return ACCENT[this.selectedDept];
  }
  get canEdit(): boolean {
    return ['pastor', 'church_representative'].includes(this.currentUser.role);
  }

  ngOnInit() {
    this.loadValues();
  }

  onDeptChange() {
    this.loadValues();
  }

  private loadValues() {
    this.myValuesByRow = this.reportService.getValuesByRow(
      this.selectedDept,
      this.currentUser.id
    );
  }
}