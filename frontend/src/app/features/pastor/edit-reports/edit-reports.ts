import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TEMPLATES, ACCENT } from '../../../core/constants/report-template.constant';
import { Table } from '../../../shared/components/table/table';
import { Router } from '@angular/router';
import { TableService } from '../../../core/services/table/table-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-reports',
  standalone: true,
  imports: [CommonModule, Table, FormsModule],
  templateUrl: './edit-reports.html',
  styleUrl: './edit-reports.css',
})
export class EditReports implements OnInit {
  private router = inject(Router);
  private reportService = inject(TableService);
  // currentUser = inject(AuthService).currentUser;
  currentUser = {
    id: 'pastor-01',
    name: 'Pastor Reyes',
    role: 'pastor',
    departmentId: 'Pastoral (District)',
  };

  departments: string[] = Object.keys(TEMPLATES);
  selectedDept: string = this.currentUser.departmentId;

  myValuesByRow: Record<string, number[]> = {};
  saving = false;

  get template() {
    return TEMPLATES[this.selectedDept];
  }
  get accent() {
    return ACCENT[this.selectedDept];
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

  onValuesChange(updated: Record<string, number[]>) {
    this.myValuesByRow = updated;
  }

  async save() {
    this.saving = true;
    await this.reportService.saveValues(
      this.selectedDept,
      this.currentUser.id,
      this.myValuesByRow
    );
    this.saving = false;
    this.router.navigate(['/reports']);
  }

  cancel() {
    this.router.navigate(['/reports']);
  }
}