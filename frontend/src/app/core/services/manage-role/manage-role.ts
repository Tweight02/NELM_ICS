import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';


export interface Department {
    department_id: number;
    department_name: string;
}


export interface Representative {
    user_id: number;

    first_name?: string;
    middle_name?: string;
    last_name?: string;
    extension_name?: string;

    church_id: number;

    department_id?: number | null;

    department?: Department | null;
}


export interface ManageRoleResponse {
    representatives: Representative[];
    departments: Department[];
}


export interface AssignDepartmentResponse {
    message: string;

    user: Representative;

    department: Department;

    previous_user: Representative | null;
}


export interface AddUserResponse {
    message: string;
    user: Representative;
}


@Injectable({
    providedIn: 'root'
})
export class ManageRoleService {

    private apiUrl = environment.churchApiUrl;

    constructor(
        private http: HttpClient
    ) { }


    getManageRoles(): Observable<ManageRoleResponse> {

        return this.http.get<ManageRoleResponse>(
            `${this.apiUrl}church_representative/manage-roles`,
            {
                withCredentials: true
            }
        );

    }


    assignUser(
        departmentId: number,
        userId: number
    ): Observable<AssignDepartmentResponse> {

        return this.http.put<AssignDepartmentResponse>(
            `${this.apiUrl}church_representative/manage-roles/${departmentId}`,
            {
                user_id: userId
            },
            {
                withCredentials: true
            }
        );

    }


    addUser(
        data: {
            department_id: number;
            first_name: string;
            middle_name?: string | null;
            last_name: string;
            extension_name?: string | null;
            birthdate: string;
            gender: string;
            email: string;
            password: string;
            password_confirmation: string;
        }
    ): Observable<AddUserResponse> {

        return this.http.post<AddUserResponse>(
            `${this.apiUrl}church_representative/manage-roles/add-user`,
            data,
            {
                withCredentials: true
            }
        );

    }

}