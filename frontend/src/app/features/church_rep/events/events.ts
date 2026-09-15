import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EventService, EventChurch } from '../../../core/services/event/event';

@Component({
  selector: 'app-events',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './events.html',
  styleUrl: './events.css',
})
export class Events implements OnInit {

  events: EventChurch[] = [];

  selectedDate: number | null = null;

  // Selected event for modal
  selectedEvent: EventChurch | null = null;

  weekdays = [
    'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
  ];

  calendarDays: (number | null)[] = [];

  monthName = '';

  constructor(private eventService: EventService, private router: Router) {}

  get currentMonth(): number {
    return this.eventService.viewMonth();
  }

  get currentYear(): number {
    return this.eventService.viewYear();
  }

  ngOnInit(): void {
    this.generateCalendar();
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService
      .getEvents(this.eventService.currentMonthKey())
      .subscribe(res => {
        this.events = res.events;

        console.log('Loaded events:', this.events);
      });
  }

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

    this.calendarDays = [];

    for (let i = 0; i < firstDay; i++) {
      this.calendarDays.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      this.calendarDays.push(day);
    }

    this.monthName = new Date(
      this.currentYear,
      this.currentMonth
    ).toLocaleString('default', {
      month: 'long'
    });
  }

  previousMonth(): void {
    let year = this.eventService.viewYear();
    let month = this.eventService.viewMonth() - 1;

    if (month < 0) {
      month = 11;
      year--;
    }

    this.eventService.viewYear.set(year);
    this.eventService.viewMonth.set(month);

    this.selectedDate = null;
    this.selectedEvent = null;

    this.generateCalendar();
    this.loadEvents();
  }

  nextMonth(): void {
    let year = this.eventService.viewYear();
    let month = this.eventService.viewMonth() + 1;

    if (month > 11) {
      month = 0;
      year++;
    }

    this.eventService.viewYear.set(year);
    this.eventService.viewMonth.set(month);

    this.selectedDate = null;
    this.selectedEvent = null;

    this.generateCalendar();
    this.loadEvents();
  }

  selectDate(day: number | null): void {
    if (!day) {
      return;
    }

    this.selectedDate = day;
  }

  isToday(day: number | null): boolean {
    if (!day) {
      return false;
    }

    const today = new Date();

    return (
      day === today.getDate() &&
      this.currentMonth === today.getMonth() &&
      this.currentYear === today.getFullYear()
    );
  }

  getEventsForDay(day: number | null): EventChurch[] {
    if (!day) {
      return [];
    }

    return this.events.filter(event => {
      const eventDate = new Date(event.date_start);

      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === this.currentMonth &&
        eventDate.getFullYear() === this.currentYear
      );
    });
  }

  hasEvents(day: number | null): boolean {
    return this.getEventsForDay(day).length > 0;
  }

  get selectedDateEvents(): EventChurch[] {
    return this.getEventsForDay(this.selectedDate);
  }

  // =========================
  // EVENT MODAL
  // =========================

  openEventModal(event: EventChurch): void {
    this.selectedEvent = event;
  }

  closeEventModal(): void {
    this.selectedEvent = null;
  }

  manageEvent(event: EventChurch): void {
    console.log('Manage event:', event);
    // Later you can navigate to your manage page here.
    // Example:
      this.router.navigate(['/church_rep/event/manage-event', event.event_id]);
  }
}