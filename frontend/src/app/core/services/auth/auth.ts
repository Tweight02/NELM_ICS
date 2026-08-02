import { Injectable, signal } from '@angular/core';

export interface User {
    id: string;
    name: string;
    role: 'pastor' | 'church_rep' | 'director' | 'secretary';
    departmentId?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    // private _currentUser = signal<User | null>(null);
    // readonly currentUser = this._currentUser.asReadonly();
    // readonly currentUser = signal<{ role: string } | null>({ role: 'pastor' }); // temp for testing
    readonly currentUser = signal<User>({
        id: 'pastor-01',
        name: 'Pastor Reyes',
        role: 'pastor',
        departmentId: 'District Pastor',
    });


    login(user: User) {
        this.currentUser.set(user);
    }

    logout() {
        this.currentUser.set({ id: '', name: '', role: 'pastor' });
    }

    // Matches the dropdown in your template
    setRole(role: User['role']) {
        this.currentUser.update(u => ({ ...u, role }));
    }
}