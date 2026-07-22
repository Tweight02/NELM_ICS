
import { DecimalPipe } from '@angular/common';
import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChurchReport {
  id: number;
  church: string;
  department: string;
  category: string;
  total: number;
  pastor: string;
  submittedDate: string;
  status: 'Complete' | 'Partial' | 'Pending Review';
  quarterly: {
    q1: { activities: number; attendance: number };
    q2: { activities: number; attendance: number };
    q3: { activities: number; attendance: number };
    q4: { activities: number; attendance: number };
  };
  programs: { name: string; count: number; participants: number }[];
  notes: string;
}
@Component({
  selector: 'app-church',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './church.html',
  styleUrl: './church.css',
})
export class Church {
  search = '';
  filterChurch = '';
  filterDept = '';
  filterCategory = '';
  sortKey = signal<'church' | 'total'>('church');
  sortDir = signal<'asc' | 'desc'>('asc');
  selected = signal<ChurchReport | null>(null);

  summary = signal([
    { label: 'Total Reports', value: '8', icon: 'fa-file-lines', bg: 'bg-emerald-500'},
    { label: 'Events', value: '13', icon: 'fa-calendar-check', bg: 'bg-blue-500'},
    { label: 'Churches', value: '9', icon: 'fa-church', bg: 'bg-purple-500'},
    { label: 'Baptisms', value: '25', icon: 'fa-hands-praying', bg: 'bg-amber-500'},
  ]);

  reports = signal<ChurchReport[]>([
    {
      id: 1, church: 'Church 1', department: 'Sabbath School', category: 'Cradleroll', total: 100,
      pastor: 'Ptr. John Doe', submittedDate: 'Nov 12, 2025', status: 'Complete',
      quarterly: { q1: { activities: 12, attendance: 450 }, q2: { activities: 14, attendance: 520 }, q3: { activities: 10, attendance: 480 }, q4: { activities: 8, attendance: 400 } },
      programs: [
        { name: 'Sabbath Morning Class', count: 12, participants: 350 },
        { name: 'Beginner Class', count: 8, participants: 120 },
        { name: 'Family Worship', count: 4, participants: 80 },
      ],
      notes: 'Consistent growth in Sabbath School attendance across all quarters. Cradle roll saw a 20% increase in new children joining. Teachers received refresher training in Q3.'
    },
    {
      id: 2, church: 'Church 1', department: 'Youth Ministry', category: 'Seminar', total: 3,
      pastor: 'Ptr. John Doe', submittedDate: 'Nov 10, 2025', status: 'Complete',
      quarterly: { q1: { activities: 1, attendance: 85 }, q2: { activities: 1, attendance: 95 }, q3: { activities: 1, attendance: 105 }, q4: { activities: 0, attendance: 0 } },
      programs: [
        { name: 'Youth Leadership Seminar', count: 2, participants: 180 },
        { name: 'Career Guidance', count: 1, participants: 105 },
      ],
      notes: 'Three major youth seminars conducted this year with excellent turnout. Focus on leadership and career development.'
    },
    {
      id: 3, church: 'Church 1', department: 'Outreach', category: 'Bible Study', total: 13,
      pastor: 'Ptr. John Doe', submittedDate: 'Nov 08, 2025', status: 'Complete',
      quarterly: { q1: { activities: 3, attendance: 220 }, q2: { activities: 4, attendance: 265 }, q3: { activities: 3, attendance: 235 }, q4: { activities: 3, attendance: 200 } },
      programs: [
        { name: 'Community Bible Study', count: 8, participants: 480 },
        { name: 'Home Bible Study', count: 5, participants: 440 },
      ],
      notes: 'Bible study groups continue to grow in the community. 13 baptism candidates identified through outreach efforts.'
    },
    {
      id: 4, church: 'Church 2', department: 'Discipleship', category: 'Training', total: 112,
      pastor: 'Ptr. John Doe', submittedDate: 'Nov 06, 2025', status: 'Complete',
      quarterly: { q1: { activities: 28, attendance: 720 }, q2: { activities: 30, attendance: 850 }, q3: { activities: 28, attendance: 780 }, q4: { activities: 26, attendance: 650 } },
      programs: [
        { name: 'Discipleship Training', count: 60, participants: 1800 },
        { name: 'Leadership Workshop', count: 30, participants: 900 },
        { name: 'Bible School', count: 22, participants: 300 },
      ],
      notes: 'Discipleship program has been very successful with 112 participants completing full training curriculum.'
    },
    {
      id: 5, church: 'Church 2', department: 'Pastoral Care', category: 'Service', total: 100,
      pastor: 'Ptr. John Doe', submittedDate: 'Nov 04, 2025', status: 'Partial',
      quarterly: { q1: { activities: 25, attendance: 380 }, q2: { activities: 26, attendance: 420 }, q3: { activities: 24, attendance: 395 }, q4: { activities: 25, attendance: 405 } },
      programs: [
        { name: 'Home Visitation', count: 60, participants: 800 },
        { name: 'Prayer Meetings', count: 40, participants: 800 },
      ],
      notes: 'Regular pastoral visits and prayer meetings continue. Q4 data still being compiled.'
    },
    {
      id: 6, church: 'Church 3', department: 'Sabbath School', category: 'Training', total: 98,
      pastor: 'Ptr. John Doe', submittedDate: 'Nov 02, 2025', status: 'Complete',
      quarterly: { q1: { activities: 24, attendance: 380 }, q2: { activities: 26, attendance: 420 }, q3: { activities: 25, attendance: 400 }, q4: { activities: 23, attendance: 370 } },
      programs: [
        { name: 'Teacher Training', count: 50, participants: 850 },
        { name: 'Curriculum Workshop', count: 48, participants: 720 },
      ],
      notes: '98 Sabbath School teachers and officers trained across the district this year.'
    },
    {
      id: 7, church: 'Church 4', department: 'Ministerial', category: 'Baptism', total: 25,
      pastor: 'Ptr. John Doe', submittedDate: 'Oct 30, 2025', status: 'Complete',
      quarterly: { q1: { activities: 5, attendance: 65 }, q2: { activities: 8, attendance: 85 }, q3: { activities: 7, attendance: 75 }, q4: { activities: 5, attendance: 55 } },
      programs: [
        { name: 'Baptismal Class', count: 15, participants: 180 },
        { name: 'Baptism Service', count: 10, participants: 100 },
      ],
      notes: '25 new members added to church through baptism this year. Praise God for the harvest!'
    },
    {
      id: 8, church: 'Church 4', department: 'Womens', category: 'Training', total: 60,
      pastor: 'Ptr. John Doe', submittedDate: 'Oct 28, 2025', status: 'Pending Review',
      quarterly: { q1: { activities: 12, attendance: 180 }, q2: { activities: 16, attendance: 220 }, q3: { activities: 18, attendance: 240 }, q4: { activities: 14, attendance: 160 } },
      programs: [
        { name: 'Women\'s Retreat', count: 20, participants: 400 },
        { name: 'Skills Training', count: 25, participants: 250 },
        { name: 'Health Seminar', count: 15, participants: 150 },
      ],
      notes: 'Active women\'s ministry programs throughout the year. Under review by district secretary.'
    },
  ]);

  filtered = computed(() => {
    let list = this.reports();
    if (this.search) {
      const s = this.search.toLowerCase();
      list = list.filter(r =>
        r.church.toLowerCase().includes(s) ||
        r.department.toLowerCase().includes(s) ||
        r.category.toLowerCase().includes(s) ||
        r.pastor.toLowerCase().includes(s)
      );
    }
    if (this.filterChurch) list = list.filter(r => r.church === this.filterChurch);
    if (this.filterDept) list = list.filter(r => r.department === this.filterDept);
    if (this.filterCategory) list = list.filter(r => r.category === this.filterCategory);

    const k = this.sortKey();
    const dir = this.sortDir() === 'asc' ? 1 : -1;
    return [...list].sort((a, b) => (a[k] > b[k] ? dir : -dir));
  });

  totalActivities = computed(() => {
    const r = this.selected();
    if (!r) return 0;
    return r.quarterly.q1.activities + r.quarterly.q2.activities + r.quarterly.q3.activities + r.quarterly.q4.activities;
  });

  avgAttendance = computed(() => {
    const r = this.selected();
    if (!r) return 0;
    const total = r.quarterly.q1.attendance + r.quarterly.q2.attendance + r.quarterly.q3.attendance + r.quarterly.q4.attendance;
    return Math.round(total / 4).toLocaleString();
  });

  toggleSort(k: 'church' | 'total') {
    if (this.sortKey() === k) this.sortDir.set(this.sortDir() === 'asc' ? 'desc' : 'asc');
    else { this.sortKey.set(k); this.sortDir.set('asc'); }
  }

  sortIcon(k: string): string {
    if (this.sortKey() !== k) return 'fa-sort';
    return this.sortDir() === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
  }

  clearFilters() {
    this.search = '';
    this.filterChurch = '';
    this.filterDept = '';
    this.filterCategory = '';
  }

  openModal(r: ChurchReport) { this.selected.set(r); }
  closeModal() { this.selected.set(null); }

  statusBadge(s: string): string {
    const m: any = {
      'Complete': 'bg-emerald-100 text-emerald-700',
      'Partial': 'bg-amber-100 text-amber-700',
      'Pending Review': 'bg-blue-100 text-blue-700',
    };
    return m[s] || 'bg-slate-100 text-slate-700';
  }
}