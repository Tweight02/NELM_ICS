export interface Pastor {
    id: string;
    fullName: string;
    church: string;
    ordainedAt: Date;
    status: 'Active' | 'Retired' | 'On Leave';
}