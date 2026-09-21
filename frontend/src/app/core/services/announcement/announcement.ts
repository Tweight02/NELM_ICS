import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Announcement {
    id: number;
    announce_by: number;
    church_id: number;
    details: string;
    date_announced: string;
    announcedBy?: any;
    church?: any;
}

export interface AnnouncementResponse {
    data: Announcement[];
    path: string;
    per_page: number;
    next_cursor: string | null;
    next_page_url: string | null;
    prev_cursor: string | null;
    prev_page_url: string | null;
}

@Injectable({
    providedIn: 'root'
})
export class AnnouncementService {

    private apiUrl = environment.churchApiUrl;

    constructor(private http: HttpClient) { }

    getAnnouncements(): Observable<AnnouncementResponse> {
        return this.http.get<AnnouncementResponse>(
            `${this.apiUrl}church_representative/announcements`,
            {
                withCredentials: true
            }
        );
    }
}