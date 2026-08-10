export type UserRole = 'pastor' | 'secretary' | 'director' | 'church_representative';

export interface AppUser {
    id: number;
    name: string;
    email: string;
    role: UserRole;
}