import { Component, OnInit } from '@angular/core';
import { EventChurch, EventService } from '../../../core/services/event/event';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-event',
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './manage-event.html',
  styleUrl: './manage-event.css',
})
export class ManageEvent implements OnInit{
  event: EventChurch | null = null;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    const eventId = Number(
      this.route.snapshot.paramMap.get('event_id')
    );

    if (!eventId) {
      return;
    }

    this.loadEvent(eventId);
  }

  loadEvent(eventId: number): void {
    this.eventService.getEvents(
      this.eventService.currentMonthKey()
    ).subscribe(res => {

      this.event = res.events.find(
        event => event.event_id === eventId
      ) ?? null;

      console.log('Selected event:', this.event);
    });
  }


}
