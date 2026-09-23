import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import {
  EventService,
  EventChurch
} from '../../../core/services/event/event';

interface CalendarCell {
  day: number;
  month: number;
  year: number;
  currentMonth: boolean;
}

type EventFilter = 'all' | 'upcoming' | 'completed';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './events.html',
  styleUrl: './events.css'
})
export class Events implements OnInit {

  // =========================
  // EVENTS
  // =========================

  events: EventChurch[] = [];

  private eventsByDate = new Map<string, EventChurch[]>();

  selectedDate: number | null = null;
  selectedEvent: EventChurch | null = null;

  weekdays = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat'
  ];

  calendarDays: CalendarCell[] = [];
  monthName = '';

  // =========================
  // EVENT LIST
  // =========================

  eventFilter: EventFilter = 'all';

  openMenuId: EventChurch['event_id'] | null = null;

  filterTabs: {
    key: EventFilter;
    label: string;
  }[] = [
    {
      key: 'all',
      label: 'All Events'
    },
    {
      key: 'upcoming',
      label: 'Upcoming'
    },
    {
      key: 'completed',
      label: 'Completed'
    }
  ];

  // =========================
  // CONSTRUCTOR
  // =========================

  constructor(
    private eventService: EventService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  // =========================
  // CURRENT MONTH / YEAR
  // =========================

  get currentMonth(): number {
    return this.eventService.viewMonth();
  }

  get currentYear(): number {
    return this.eventService.viewYear();
  }

  // =========================
  // INIT
  // =========================

  ngOnInit(): void {
    this.generateCalendar();
    this.loadEvents();
  }

  // =========================
  // DATE KEY
  // =========================

  private dateKey(
    year: number,
    month: number,
    day: number
  ): string {
    return `${year}-${month}-${day}`;
  }

  // =========================
  // LOAD EVENTS
  // =========================

  loadEvents(): void {
    this.eventService
      .getEvents(this.eventService.currentMonthKey())
      .subscribe({
        next: (res) => {
          this.events = res.events ?? [];

          this.indexEventsByDate();

          this.cdr.markForCheck();
        },

        error: (error) => {
          console.error(
            'Failed to load events:',
            error
          );

          this.events = [];
          this.eventsByDate.clear();

          this.cdr.markForCheck();
        }
      });
  }

  // =========================
  // INDEX EVENTS
  // =========================
  private indexEventsByDate(): void {
    this.eventsByDate = new Map<string, EventChurch[]>();
    for (const event of this.events) {
      if (!event.date_start) {
        continue;
      }
      const eventDate = new Date(event.date_start);
      const key = this.dateKey(
        eventDate.getFullYear(),
        eventDate.getMonth(),
        eventDate.getDate()
      );
      const bucket = this.eventsByDate.get(key);
      if (bucket) {
        bucket.push(event);
      } else {
        this.eventsByDate.set(key, [event]);
      }
    }
  }

  // =========================
  // GENERATE CALENDAR
  // =========================
  generateCalendar(): void {

    const firstDay = new Date(
      this.currentYear,
      this.currentMonth,
      1
    ).getDay();

    const daysInMonth = new Date(
      this.currentYear,
      this.currentMonth + 1,
      0
    ).getDate();

    const prevMonth =
      this.currentMonth === 0
        ? 11
        : this.currentMonth - 1;

    const prevYear =
      this.currentMonth === 0
        ? this.currentYear - 1
        : this.currentYear;

    const daysInPrevMonth =
      new Date(
        prevYear,
        prevMonth + 1,
        0
      ).getDate();

    const nextMonth =
      this.currentMonth === 11
        ? 0
        : this.currentMonth + 1;

    const nextYear =
      this.currentMonth === 11
        ? this.currentYear + 1
        : this.currentYear;

    this.calendarDays = [];

    // Previous month's days
    for (
      let i = firstDay - 1;
      i >= 0;
      i--
    ) {
      this.calendarDays.push({
        day: daysInPrevMonth - i,
        month: prevMonth,
        year: prevYear,
        currentMonth: false
      });
    }

    // Current month's days
    for (
      let day = 1;
      day <= daysInMonth;
      day++
    ) {
      this.calendarDays.push({
        day,
        month: this.currentMonth,
        year: this.currentYear,
        currentMonth: true
      });
    }

    // Next month's days
    let nextDay = 1;

    while (this.calendarDays.length < 42) {
      this.calendarDays.push({
        day: nextDay++,
        month: nextMonth,
        year: nextYear,
        currentMonth: false
      });
    }

    // Month name
    this.monthName =
      new Date(
        this.currentYear,
        this.currentMonth
      ).toLocaleString(
        'default',
        {
          month: 'long'
        }
      );
  }

  // =========================
  // PREVIOUS MONTH
  // =========================

  previousMonth(): void {

    let year =
      this.eventService.viewYear();

    let month =
      this.eventService.viewMonth() - 1;

    if (month < 0) {
      month = 11;
      year--;
    }

    // Update signals
    this.eventService.viewYear.set(year);
    this.eventService.viewMonth.set(month);

    // Reset selection
    this.selectedDate = null;
    this.selectedEvent = null;
    this.openMenuId = null;

    // Regenerate calendar
    this.generateCalendar();

    // Load events for new month
    this.loadEvents();
  }

  // =========================
  // NEXT MONTH
  // =========================

  nextMonth(): void {

    let year =
      this.eventService.viewYear();

    let month =
      this.eventService.viewMonth() + 1;

    if (month > 11) {
      month = 0;
      year++;
    }

    // Update signals
    this.eventService.viewYear.set(year);
    this.eventService.viewMonth.set(month);

    // Reset selection
    this.selectedDate = null;
    this.selectedEvent = null;
    this.openMenuId = null;

    // Regenerate calendar
    this.generateCalendar();

    // Load events for new month
    this.loadEvents();
  }

  // =========================
  // SELECT DATE
  // =========================

  selectDate(cell: CalendarCell): void {

    if (!cell.currentMonth) {
      return;
    }

    this.selectedDate = cell.day;

    const events =
      this.getEventsForDay(cell);

    if (events.length > 0) {
      this.selectedEvent = events[0];
    } else {
      this.selectedEvent = null;
    }
  }

  // =========================
  // TODAY
  // =========================

  isToday(cell: CalendarCell): boolean {

    const today = new Date();

    return (
      cell.day === today.getDate() &&
      cell.month === today.getMonth() &&
      cell.year === today.getFullYear()
    );
  }

  // =========================
  // GET EVENTS FOR DAY
  // =========================

  getEventsForDay(
    cell: CalendarCell | null
  ): EventChurch[] {

    if (!cell) {
      return [];
    }

    return (
      this.eventsByDate.get(
        this.dateKey(
          cell.year,
          cell.month,
          cell.day
        )
      ) ?? []
    );
  }

  // =========================
  // CHECK EVENTS
  // =========================

  hasEvents(
    cell: CalendarCell | null
  ): boolean {

    return (
      this.getEventsForDay(cell)
        .length > 0
    );
  }

  // =========================
  // SELECTED DATE EVENTS
  // =========================

  get selectedDateEvents(): EventChurch[] {

    if (
      this.selectedDate === null
    ) {
      return [];
    }

    return this.getEventsForDay({
      day: this.selectedDate,
      month: this.currentMonth,
      year: this.currentYear,
      currentMonth: true
    });
  }

  // =========================
  // EVENT MODAL
  // =========================

  openEventModal(
    event: EventChurch
  ): void {

    this.selectedEvent = event;
    this.openMenuId = null;

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // =========================
  // CLOSE EVENT MODAL
  // =========================

  closeEventModal(): void {
    this.selectedEvent = null;
  }

  // =========================
  // MANAGE EVENT
  // =========================

  manageEvent(
    event: EventChurch
  ): void {

    this.router.navigate([
      '/church_rep/event/manage-event',
      event.event_id
    ]);
  }

  // =========================
  // FILTERED EVENTS
  // =========================
  get filteredEvents(): EventChurch[] {
    const sorted = [...this.events].sort((a, b) => {
      if (!a.date_start && !b.date_start) {
        return 0;
      }
      if (!a.date_start) {
        return 1;
      }
      if (!b.date_start) {
        return -1;
      }
      return (
        new Date(a.date_start).getTime() -
        new Date(b.date_start).getTime()
      );
    });
    if (this.eventFilter === 'all') {
      return sorted;
    }
    return sorted.filter(
      event =>
        this.normalize(event.status) === this.eventFilter
    );
  }

  // =========================
  // SET FILTER
  // =========================

  setFilter(
    key: EventFilter
  ): void {

    this.eventFilter = key;
    this.openMenuId = null;
  }

  // =========================
  // COUNT BY STATUS
  // =========================

  countByStatus(
    key: EventFilter
  ): number {

    if (key === 'all') {
      return this.events.length;
    }

    return this.events.filter(
      event =>
        this.normalize(
          event.status
        ) === key
    ).length;
  }

  // =========================
  // UPCOMING
  // =========================

  isUpcoming(
    event: EventChurch
  ): boolean {

    return (
      this.normalize(
        event.status
      ) === 'upcoming'
    );
  }

  // =========================
  // MENU
  // =========================

  toggleMenu(
    id: EventChurch['event_id']
  ): void {

    this.openMenuId =
      this.openMenuId === id
        ? null
        : id;
  }

  // =========================
  // DATE BLOCK CLASS
  // =========================

  getDateBlockClass(
    status?: string
  ): string {

    switch (
      this.normalize(status)
    ) {

      case 'upcoming':
        return 'bg-rose-50 text-rose-900';

      case 'completed':
        return 'bg-emerald-50 text-emerald-800';

      default:
        return 'bg-amber-50 text-amber-900';
    }
  }

  // =========================
  // PARTICIPANT COUNT
  // =========================

  participantCount(
    event: EventChurch
  ): number {

    return (
      (event as any)
        .participants_count ?? 0
    );
  }

  // =========================
  // CLOSE MENU WHEN CLICKING
  // OUTSIDE
  // =========================

  @HostListener(
    'document:click',
    ['$event']
  )
  onDocumentClick(
    event: MouseEvent
  ): void {

    const target =
      event.target as HTMLElement;

    if (
      !target.closest(
        '[data-menu]'
      )
    ) {
      this.openMenuId = null;
    }
  }

  // =========================
  // NORMALIZE STATUS
  // =========================

  private normalize(
    status?: string
  ): string {

    return (
      status ?? ''
    ).toLowerCase();
  }
}