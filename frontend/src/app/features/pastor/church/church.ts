import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CHURCHES, DEPARTMENTS, PROGRAMS, STATUSES } from '../../../core/constants/church-report-filter.constant';
import { ChurchReportEntry } from '../../../core/models/church/church-report.model';

@Component({
  selector: 'app-church',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './church.html',
})
export class Church {
  // Filter option lists, for the template dropdowns
  churches = CHURCHES;
  departments = DEPARTMENTS;
  programs = PROGRAMS;
  statuses = STATUSES;

  // Current filter state — each one is a signal
  search = signal('');
  selectedChurch = signal('');
  selectedDepartment = signal('');
  selectedProgram = signal('');
  selectedStatus = signal('');

  // Mock data — replace with a service call, e.g. inject(ChurchReportService).getAll()
  allReports = signal<ChurchReportEntry[]>([
    { id: '1', church: 'Church 1', department: 'Youth Ministry', program: 'Bible Study', date: '2026-05-12', submittedBy: 'Alex' },
    { id: '2', church: 'Church 2', department: 'Sabbath School', program: 'Sabbath School', date: '2026-05-14', submittedBy: 'Alex' },
    { id: '3', church: 'Church 1', department: 'Womens', program: 'Seminar', date: '2026-05-20', submittedBy: 'Alex' },
    { id: '4', church: 'Church 3', department: 'Ministerial', program: 'Training', date: '2026-06-02', submittedBy: 'Alex' },
  ]);

  // Recomputes automatically whenever any filter signal or the data changes
  filteredReports = computed(() => {
    const search = this.search().toLowerCase().trim();

    return this.allReports().filter(r =>
      (!this.selectedChurch() || r.church === this.selectedChurch()) &&
      (!this.selectedDepartment() || r.department === this.selectedDepartment()) &&
      (!this.selectedProgram() || r.program === this.selectedProgram()) &&
      (!this.selectedStatus() || true) && // wire this to a real status field once your model has one
      (!search ||
        r.church.toLowerCase().includes(search) ||
        r.department.toLowerCase().includes(search) ||
        r.program.toLowerCase().includes(search))
    );
  });

  resetFilters() {
    this.search.set('');
    this.selectedChurch.set('');
    this.selectedDepartment.set('');
    this.selectedProgram.set('');
    this.selectedStatus.set('');
  }
}