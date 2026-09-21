import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EventChurch, EventService } from '../../../core/services/event/event';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-event',
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    RouterLink
  ],
  templateUrl: './manage-event.html',
  styleUrl: './manage-event.css',
})
export class ManageEvent implements OnInit {
  event: EventChurch | null = null;
  participants: any[] = [];
  searchParticipant = '';
  editingEvent = false;
  editEvent: any = {
    type: '',
    title: '',
    date_start: '',
    date_end: '',
    description: '',
    status: '',
    time: '',
    address: ''
  };

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const eventId = Number(
      this.route.snapshot.paramMap.get('event_id')
    );
    if (!eventId) {
      return;
    }
    this.loadEvent(eventId);
    this.viewParticipants(eventId);
  }

  // =========================
  // LOAD EVENT
  // =========================
  loadEvent(eventId: number): void {
    this.eventService
      .getEvents(
        this.eventService.currentMonthKey()
      )
      .subscribe(res => {
        this.event =
          res.events.find(
            event =>
              event.event_id === eventId
          ) ?? null;
        this.cdr.markForCheck();
      });
  }

  // =========================
  // OPEN EDIT MODAL
  // =========================

  startEditing(): void {
    if (!this.event) {
      return;
    }
    this.editEvent = {
      type: this.event.type ?? '',
      title: this.event.title ?? '',
      date_start: this.event.date_start
        ? String(this.event.date_start).split('T')[0]
        : '',
      date_end: this.event.date_end
        ? String(this.event.date_end).split('T')[0]
        : '',
      description: this.event.description ?? '',
      status: this.event.status ?? 'Upcoming',
      time: this.event.time ?? '',
      address: this.event.address ?? ''
    };
    this.editingEvent = true;
    this.cdr.markForCheck();
  }

  // =========================
  // SAVE EVENT
  // =========================
  saveEvent(): void {
    if (
      !this.event ||
      this.event.event_id === undefined
    ) {
      return;
    }
    this.eventService
      .updateEvent(
        this.event.event_id,
        this.editEvent
      )
      .subscribe({
        next: (response: any) => {
          console.log(
            'Event updated:',
            response
          );
          this.event = {
            ...this.event!,
            ...this.editEvent
          };
          this.editingEvent = false;
          this.cdr.detectChanges();
          Swal.fire({
            title: 'Event updated!',
            text: 'The event has been updated successfully.',
            icon: 'success',
            confirmButtonColor: '#059669'
          });
        },
        error: (error) => {
          console.error(
            'Failed to update event:',
            error
          );
          Swal.fire({
            title: 'Update failed',
            text: 'Unable to update the event. Please try again.',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
        }
      });
  }

  // =========================
  // CANCEL EDIT
  // =========================
  cancelEditing(): void {
    this.editingEvent = false;
  }

  // =========================
  // PARTICIPANTS
  // =========================
  viewParticipants(eventId: number): void {
    console.log(
      'EVENT ID BEING SENT:',
      eventId
    );
    this.eventService
      .viewParticipants(eventId)
      .subscribe({
        next: (response: any) => {
          this.participants =
            response.participants ?? [];
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error(
            'PARTICIPANT API ERROR:',
            error
          );
        }
      });
  }

  // =========================
  // FILTER PARTICIPANTS
  // =========================
  get filteredParticipants(): any[] {
    const search =
      this.searchParticipant
        .trim()
        .toLowerCase();
    if (!search) {
      return this.participants;
    }
    return this.participants.filter(
      participant => {
        const name = `
          ${participant.first_name}
          ${participant.middle_name}
          ${participant.last_name}
          ${participant.extension_name ?? ''}
        `.toLowerCase();
        const church =
          (
            participant.church?.name ?? ''
          ).toLowerCase();
        return (
          name.includes(search) ||
          church.includes(search)
        );
      }
    );
  }

  // =========================
  // REMOVE PARTICIPANT
  // =========================
  removeParticipant(
    participant: any
  ): void {
    const participantName = `
      ${participant.first_name}
      ${participant.middle_name}
      ${participant.last_name}
  `.trim();
    Swal.fire({
      title: 'Remove Participant?',
      text:
        `Are you sure you want to remove ${participantName} from this event?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      reverseButtons: true
    }).then(result => {
      if (result.isConfirmed) {
        this.eventService
          .removeParticipant(
            participant.participant_id
          )
          .subscribe({
            next: (response) => {
              console.log(
                'Participant removed:',
                response
              );
              this.participants =
                this.participants.filter(
                  p =>
                    p.participant_id !==
                    participant.participant_id
                );
              this.cdr.markForCheck();
              Swal.fire({
                title: 'Removed!',
                text:
                  `${participantName} has been removed from this event.`,
                icon: 'success',
                confirmButtonColor: '#059669'
              });
            },
            error: (error) => {
              console.error(
                'Failed to remove participant:',
                error
              );
              Swal.fire({
                title: 'Error',
                text:
                  'Failed to remove the participant. Please try again.',
                icon: 'error',
                confirmButtonColor: '#059669'
              });
            }
          });
      }
    });
  }
}