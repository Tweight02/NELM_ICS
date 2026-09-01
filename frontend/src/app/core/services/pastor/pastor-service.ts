import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root',
})

export class PastorService {
    private base = environment.churchApiUrl;
    constructor (private http: HttpClient){}

    getData(): Observable<any>{
        return this.http.get(`${this.base}/pastor`);
    }
}
