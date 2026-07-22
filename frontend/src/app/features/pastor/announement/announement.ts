import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


interface Announcement {
  id: number;
  title: string;
  category: string;
  author: string;
  date: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Published' | 'Draft' | 'Archived';
  content: string;
}
@Component({
  selector: 'app-announement',
  imports: [CommonModule, FormsModule],
  templateUrl: './announement.html',
  styleUrl: './announement.css',
})

export class Announement {
  search = '';
  filterPriority = '';
  filterCategory = '';
  selected = signal<Announcement | null>(null);

  items = signal<Announcement[]>([
    { id: 1, title: 'Year-End Mission Convocation 2025', category: 'Event', author: 'NELM President', date: 'Nov 12, 2025', priority: 'High', status: 'Published', content: 'All pastors, elders, and church officers are cordially invited to the Year-End Mission Convocation on December 15-17 at the NELM headquarters. Registration is now open.' },
    { id: 2, title: 'Quarterly Report Submission Reminder', category: 'General', author: 'Executive Secretary', date: 'Nov 10, 2025', priority: 'Medium', status: 'Published', content: 'This is a friendly reminder that all quarterly reports must be submitted on or before November 30, 2025 through the ICS portal.' },
    { id: 3, title: 'Youth Rally Registration Open', category: 'Ministry', author: 'Youth Director', date: 'Nov 08, 2025', priority: 'Medium', status: 'Published', content: 'Registration for the annual Youth Rally in Cauayan City is now open. All church youth are encouraged to register through their local youth leader.' },
    { id: 4, title: 'Emergency Prayer Request', category: 'Urgent', author: 'NELM Ministerial', date: 'Nov 05, 2025', priority: 'High', status: 'Published', content: 'We urgently request prayers for our brethren affected by the recent typhoon in the Cagayan Valley region.' },
    { id: 5, title: 'New Report Submission Guidelines', category: 'General', author: 'Executive Secretary', date: 'Nov 03, 2025', priority: 'Low', status: 'Published', content: 'Please review the updated guidelines for report submissions effective January 2026.' },
    { id: 6, title: 'Christmas Program Committee', category: 'Event', author: 'Communication Dept.', date: 'Nov 01, 2025', priority: 'Low', status: 'Draft', content: 'The Christmas program committee has been formed. Members will be announced next week.' },
  ]);

  filtered = computed(() => {
    let list = this.items();
    if (this.search) list = list.filter(a => a.title.toLowerCase().includes(this.search.toLowerCase()));
    if (this.filterPriority) list = list.filter(a => a.priority === this.filterPriority);
    if (this.filterCategory) list = list.filter(a => a.category === this.filterCategory);
    return list;
  });

  view(a: Announcement) { this.selected.set(a); }
  close() { this.selected.set(null); }

  priorityBadge(p: string): string {
    const m: any = {
      High: 'bg-red-100 text-red-700',
      Medium: 'bg-amber-100 text-amber-700',
      Low: 'bg-blue-100 text-blue-700',
    };
    return m[p] || 'bg-gray-100 text-gray-700';
  }
}
