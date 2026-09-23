import { Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { EventParticipant } from '../../models/reports/participant.model';

export interface EventChurch{
    event_id?: number,
    par_item_id?: number,
    status?: string,
    type?: string,
    title: string,
    date_start?: Date,
    date_end?: Date,
    description: string,
    time: string,
    address: string,
    participants?: EventParticipant[];
}

@Injectable({ providedIn: 'root' })
export class EventService {
    private apiUrl = environment.churchApiUrl;

    private readonly today = new Date();
    viewYear = signal(this.today.getFullYear());
    viewMonth = signal(this.today.getMonth());
    
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
        withCredentials: true,
    };

    constructor(private http: HttpClient) {}

    public currentMonthKey(): string {
        const month = (this.viewMonth() + 1).toString().padStart(2, '0');
        return `${this.viewYear()}-${month}`;
    }

    createEvent(report: EventChurch){
        return this.http.post(`${this.apiUrl}church_representative/save-event`,report);
    }

    getEvents(month: string) {
        const params = new HttpParams().set('month', month);
        return this.http.get<{ events: EventChurch[] }>(
            `${this.apiUrl}church_representative/event`,
            { params }
        );
    }

    manageEvent(eventId: number, data: any) {
        return this.http.put(
            `${this.apiUrl}/church_representative/event/manage-event/${eventId}`,
            data
        );
    }

    updateEvent(eventId: number, data: any) {
        return this.http.put(
            `${this.apiUrl}church_representative/event/update/${eventId}`,
            data,
            {
                withCredentials: true
            }
        );
    }

    viewParticipants(eventId: number) {
        return this.http.get(
            `${this.apiUrl}church_representative/event/participants`,
            {
            params: {
                event_id: eventId
            },
            withCredentials: true
            }
        );
    }

    removeParticipant(participantId: number) {
        return this.http.delete(
            `${this.apiUrl}church_representative/event/participant/${participantId}`,
            {
                withCredentials: true
            }
        );
    }
}
