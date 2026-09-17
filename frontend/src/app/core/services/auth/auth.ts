import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, tap, catchError, of } from 'rxjs';

export interface User {
    id: number;
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
    birthdate: Date;
    gender: string;
    role: string;
    department_id: number;
    church_id: number;
    church?: {
        church_id: number;
        name: string;
        address?: string;
        parent_id?: number;
        district?: {
            church_id: number;
            name: string;
            address?: string;
            parent_id?: number;
        };
    };
    department?: Department;
}

export interface Department {
    department_id: number;
    department_name: string;
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

    private platformId = inject(PLATFORM_ID);

    currentUser = signal<User | null>(null);
    isLoading = signal<boolean>(true);

    constructor(private http: HttpClient) {
        if (!isPlatformBrowser(this.platformId)) {
            this.isLoading.set(false);
        }
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
     * Only ever called client-side (see constructor) — never during SSR.
     */
    public restoreUser(): void {
        this.isLoading.set(true);

        this.http.get<User>(
            `${this.mainApiUrl}/user`,
            { withCredentials: true }
        ).pipe(
            catchError(error => {
                console.error('RESTORE USER ERROR:', error);
                console.error('Status:', error.status);
                console.error('Response:', error.error);
                this.currentUser.set(null);
                this.isLoading.set(false);

                return of(null);
            })
        ).subscribe(user => {
            console.log('RESTORED USER:', user);

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

    /**
     * Role-based helpers — centralize this logic here rather than
     * repeating role checks across components.
     */
    canEdit(): boolean {
        const role = this.currentUser()?.role;
        return role === 'church_representative' || role === 'pastor';
    }

    isReadOnly(): boolean {
        return !this.canEdit();
    }

    isDirector(): boolean {
        return this.currentUser()?.role === 'director';
    }

    isSecretary(): boolean {
        return this.currentUser()?.role === 'secretary';
    }
}