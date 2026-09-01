import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, tap, catchError, of } from 'rxjs';

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

export interface LoginResponse {
    user: User;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    // main-api is the only app that handles login/logout/csrf
    private mainApiUrl = 'http://api.icsnelm.test:8001';
    private rootUrl = 'http://api.icsnelm.test:8001'; // for /sanctum/csrf-cookie

    currentUser = signal<User | null>(null);
    isLoading = signal<boolean>(true);

    constructor(private http: HttpClient) {
        this.restoreUser();
    }

    /**
     * Sanctum's CSRF cookie endpoint — must be called before login/logout
     */
    private csrf(): Observable<unknown> {
        return this.http.get(`${this.rootUrl}/sanctum/csrf-cookie`, { withCredentials: true });
    }

    /**
     * Login
     */
    login(email: string, password: string): Observable<LoginResponse> {
        return this.csrf().pipe(
            switchMap(() =>
                this.http.post<LoginResponse>(
                    `${this.mainApiUrl}/login`,
                    { email, password },
                    { withCredentials: true }
                )
            ),
            tap(response => {
                this.currentUser.set(response.user);
                this.isLoading.set(false);
            })
        );
    }

    /**
     * Restore user on page refresh — ask the server, since there's no
     * token to check locally. The cookie (if valid) is sent automatically.
     */
    private restoreUser(): void {
        this.http.get<User>(`${this.mainApiUrl}/user`, { withCredentials: true }).pipe(
            catchError(() => {
                this.currentUser.set(null);
                return of(null);
            })
        ).subscribe(user => {
            this.currentUser.set(user);
            this.isLoading.set(false);
        });
    }

    /**
     * Logout
     */
    logout(): Observable<unknown> {
        return this.http.post(`${this.mainApiUrl}/logout`, {}, { withCredentials: true })
            .pipe(tap(() => this.currentUser.set(null)));
    }

    /**
     * Check whether user is logged in — no token to check locally,
     * so this reflects whatever restoreUser()/login() last confirmed.
     */
    isLoggedIn(): boolean {
        return this.currentUser() !== null;
    }
}