import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

interface Report {
  id: number;
  title: string;
  department: string;
  date: string;
  period: string;
  status: 'Approved' | 'Pending';
  submittedBy: string;
  summaryData: {
    category: string;
    q1: number;
    q2: number;
    q3: number;
    q4: number;
    total: number;
  }[];
}

@Component({
  selector: 'app-reports',
  imports: [CommonModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css',
})
export class Reports {
 isModalOpen = signal(false);
  selectedReport = signal<Report | null>(null);

  reports: Report[] = [
    {
      id: 1,
      title: 'Youth Leadership Summit',
      department: 'Youth Ministry',
      date: 'Jan 29, 2026',
      period: 'Q1 2026',
      status: 'Approved',
      submittedBy: 'Rev. John Doe',
      summaryData: [
        { category: 'Seminars Conducted', q1: 4, q2: 0, q3: 0, q4: 0, total: 4 },
        { category: 'Participants', q1: 120, q2: 0, q3: 0, q4: 0, total: 120 },
        { category: 'New Leaders', q1: 15, q2: 0, q3: 0, q4: 0, total: 15 }
      ]
    },
    {
      id: 2,
      title: 'Campus Encounter',
      department: 'Campus Ministry',
      date: 'Jan 18, 2026',
      period: 'Q1 2026',
      status: 'Approved',
      submittedBy: 'Ptr. Jane Smith',
      summaryData: [
        { category: 'Campus Visits', q1: 12, q2: 0, q3: 0, q4: 0, total: 12 },
        { category: 'Bible Studies', q1: 24, q2: 0, q3: 0, q4: 0, total: 24 },
        { category: 'Baptisms', q1: 3, q2: 0, q3: 0, q4: 0, total: 3 }
      ]
    },
    {
      id: 3,
      title: 'Community Outreach Program',
      department: 'Sabbath School',
      date: 'Feb 10, 2026',
      period: 'Q1 2026',
      status: 'Approved',
      submittedBy: 'Elder Mike Johnson',
      summaryData: [
        { category: 'Feeding Programs', q1: 6, q2: 4, q3: 5, q4: 8, total: 23 },
        { category: 'Medical Missions', q1: 2, q2: 1, q3: 2, q4: 3, total: 8 },
        { category: 'Beneficiaries', q1: 450, q2: 320, q3: 380, q4: 520, total: 1670 }
      ]
    },
    {
      id: 4,
      title: 'Family Life Seminar',
      department: 'Family Ministries',
      date: 'Apr 15, 2026',
      period: 'Q2 2026',
      status: 'Pending',
      submittedBy: 'Ptr. Sarah Lee',
      summaryData: [
        { category: 'Sessions Held', q1: 0, q2: 3, q3: 0, q4: 0, total: 3 },
        { category: 'Couples Attended', q1: 0, q2: 25, q3: 0, q4: 0, total: 25 },
        { category: 'Materials Distributed', q1: 0, q2: 50, q3: 0, q4: 0, total: 50 }
      ]
    }
  ];

  openModal(report: Report) {
    this.selectedReport.set(report);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.selectedReport.set(null);
  }

  calculateQuarterTotal(quarter: 'q1' | 'q2' | 'q3' | 'q4'): number {
    const data = this.selectedReport()?.summaryData || [];
    return data.reduce((sum, item) => sum + item[quarter], 0);
  }

  calculateGrandTotal(): number {
    const data = this.selectedReport()?.summaryData || [];
    return data.reduce((sum, item) => sum + item.total, 0);
  }
}
