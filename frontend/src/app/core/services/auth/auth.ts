import { Injectable, signal } from '@angular/core';

export interface User {
    id: string;
    name: string;
    role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _currentUser = signal<User | null>(null);
    // readonly currentUser = this._currentUser.asReadonly();
    readonly currentUser = signal<{ role: string } | null>({ role: 'pastor' }); // temp for testing

    login(user: User) {
        this._currentUser.set(user);
    }

    logout() {
        this._currentUser.set(null);
    }
}