import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

export interface LoginResponse {
    message: string;
    user: User;
    token: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private apiUrl = 'http://localhost:8000/api';

    // Current logged-in user
    currentUser = signal<User | null>(null);

    // Used to know whether Angular is checking the existing login
    isLoading = signal<boolean>(true);

    constructor(private http: HttpClient) {
        this.restoreUser();
    }

    /**
     * Login
     */
    login(email: string, password: string): Observable<LoginResponse> {

        console.time('API LOGIN');

        return this.http.post<LoginResponse>(
            `${this.apiUrl}/login`,
            {
                email,
                password
            }
        ).pipe(

            tap(response => {

                console.timeEnd('API LOGIN');

                console.log('Login response:', response);

                localStorage.setItem('token', response.token);

                this.currentUser.set(response.user);

                this.isLoading.set(false);

            })

        );
    }

    /**
     * Restore user when browser is refreshed
     */
    private restoreUser(): void {
        const token = localStorage.getItem('token');
        // No token means nobody is logged in
        if (!token) {
            this.isLoading.set(false);
            return;
        }
        // Token exists, ask Laravel who the user is
        this.http.get<User>(
            `${this.apiUrl}/user`
        ).subscribe({
            next: (user) => {
                this.currentUser.set(user);
                this.isLoading.set(false);
            },
            error: () => {
                // Token is invalid/expired
                localStorage.removeItem('token');
                this.currentUser.set(null);
                this.isLoading.set(false);
            }
        });
    }

    /**
     * Logout
     */
    logout(): Observable<any> {
        return this.http.post(
            `${this.apiUrl}/logout`,
            {}
        ).pipe(
            tap(() => {
                localStorage.removeItem('token');
                this.currentUser.set(null);
            })
        );
    }

    /**
     * Check whether user is logged in
     */
    isLoggedIn(): boolean {
        return !!localStorage.getItem('token');
    }
    /**
     * Get token
     */
    getToken(): string | null {
        return localStorage.getItem('token');
    }
}