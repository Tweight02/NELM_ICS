import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Evt {
  date: string;
  title: string;
  time: string;
  type: 'Meeting' | 'Service' | 'Event' | 'Training';
  location: string;
}
@Component({
  selector: 'app-tasks',
  imports: [],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks {
  weekdays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  current = signal(new Date());
  selectedDay = signal<number | null>(null);
  selectedEvent = signal<Evt | null>(null);

  events = signal<Evt[]>([
    { date: '2025-11-18', title: 'Pastors Conference', time: '9:00 AM', type: 'Meeting', location: 'NELM Office' },
    { date: '2025-11-22', title: 'Youth Rally', time: '2:00 PM', type: 'Event', location: 'Cauayan City' },
    { date: '2025-11-25', title: 'Elders Meeting', time: '10:00 AM', type: 'Meeting', location: 'Ilagan' },
    { date: '2025-11-15', title: 'Sabbath Service', time: '8:00 AM', type: 'Service', location: 'Ilagan Central' },
    { date: '2025-11-28', title: 'Leadership Training', time: '1:00 PM', type: 'Training', location: 'NELM Hall' },
  ]);

  monthLabel = computed(() => this.current().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));

  days = computed(() => {
    const d = this.current();
    const first = new Date(d.getFullYear(), d.getMonth(), 1).getDay();
    const total = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    const arr: (number | null)[] = Array(first).fill(null);
    for (let i = 1; i <= total; i++) arr.push(i);
    while (arr.length % 7 !== 0) arr.push(null);
    return arr;
  });

  visibleEvents = computed(() => {
    const d = this.current();
    const y = d.getFullYear();
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    return this.events().filter(e => {
      if (!e.date.startsWith(`${y}-${m}`)) return false;
      if (this.selectedDay()) {
        const day = e.date.split('-')[2];
        return parseInt(day) === this.selectedDay();
      }
      return true;
    });
  });

  prev() { const d = new Date(this.current()); d.setMonth(d.getMonth() - 1); this.current.set(d); this.selectedDay.set(null); }
  next() { const d = new Date(this.current()); d.setMonth(d.getMonth() + 1); this.current.set(d); this.selectedDay.set(null); }
  selectDay(day: number) { this.selectedDay.set(this.selectedDay() === day ? null : day); }
  openEvent(e: Evt) { this.selectedEvent.set(e); }

  hasEvent(day: number | null): boolean {
    if (!day) return false;
    const d = this.current();
    const dateStr = `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${day.toString().padStart(2,'0')}`;
    return this.events().some(e => e.date === dateStr);
  }

  dayClass(day: number | null): string {
    if (!day) return 'invisible';
    const today = new Date();
    const d = this.current();
    const isToday = day === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    if (isToday) return 'bg-emerald-600 text-white font-bold hover:bg-emerald-700';
    if (this.selectedDay() === day) return 'bg-emerald-100 text-emerald-700 font-semibold';
    return 'hover:bg-gray-100 text-gray-700';
  }

  typeBg(t: string): string {
    const m: any = { Meeting: 'bg-blue-500', Service: 'bg-purple-500', Event: 'bg-emerald-500', Training: 'bg-amber-500' };
    return m[t] || 'bg-gray-500';
  }
  typeIcon(t: string): string {
    const m: any = { Meeting: 'fa-users', Service: 'fa-church', Event: 'fa-star', Training: 'fa-chalkboard-user' };
    return m[t] || 'fa-calendar';
  }
  typeBadge(t: string): string {
    const m: any = { Meeting: 'bg-blue-100 text-blue-700', Service: 'bg-purple-100 text-purple-700', Event: 'bg-emerald-100 text-emerald-700', Training: 'bg-amber-100 text-amber-700' };
    return m[t] || 'bg-gray-100 text-gray-700';
  }
}
