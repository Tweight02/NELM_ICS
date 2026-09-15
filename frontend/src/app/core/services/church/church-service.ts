// core/services/church/church-service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Church {
    church_id: number;
    parent_id: number | null;
    name: string;
}

@Injectable({ providedIn: 'root' })
export class ChurchService {
    private http = inject(HttpClient);

    getAll(): Observable<Church[]> {
        return this.http.get<Church[]>('/api/churches'); // adjust to your endpoint
    }
}