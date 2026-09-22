import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import Swal from 'sweetalert2';

import {
  ManageRoleService,
  Department,
  Representative
} from '../../../core/services/manage-role/manage-role';


@Component({
  selector: 'app-manage-role',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],

  templateUrl: './manage-role.html',

  styleUrl: './manage-role.css'
})
export class ManageRole implements OnInit {

  representatives: Representative[] = [];

  departments: Department[] = [];

  loading = true;

  saving = false;

  error = '';

  /*
   * Stores the currently selected user
   * for every department.
   */
  selectedUsers: {
    [departmentId: number]: number | null
  } = {};


  /*
   * Add User modal
   */
  showAddUser = false;

  addUserForm!: FormGroup;

  addingUser = false;


  constructor(
    private manageRoleService: ManageRoleService,

    private fb: FormBuilder,

    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {

    this.initializeAddUserForm();

    this.loadManageRoles();

  }


  /**
   * Initialize Add User Form
   */
  initializeAddUserForm(): void {

    this.addUserForm =
      this.fb.group({

        department_id: [
          null,
          Validators.required
        ],

        first_name: [
          '',
          [
            Validators.required,
            Validators.maxLength(100)
          ]
        ],

        middle_name: [
          '',
          Validators.maxLength(100)
        ],

        last_name: [
          '',
          [
            Validators.required,
            Validators.maxLength(100)
          ]
        ],

        extension_name: [
          '',
          Validators.maxLength(20)
        ],

        birthdate: [
          '',
          Validators.required
        ],

        gender: [
          '',
          Validators.required
        ],

        email: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.maxLength(255)
          ]
        ],

        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8)
          ]
        ],

        password_confirmation: [
          '',
          Validators.required
        ]

      });

  }


  /**
   * Load departments and representatives.
   */
  loadManageRoles(): void {

    this.loading = true;

    this.error = '';

    this.manageRoleService
      .getManageRoles()
      .subscribe({

        next: response => {

          this.representatives =
            response.representatives;

          this.departments =
            response.departments;

          /*
           * Initialize selected users.
           */
          this.selectedUsers = {};

          this.departments.forEach(
            department => {

              this.selectedUsers[
                department.department_id
              ] =
                this.getAssignedUser(
                  department.department_id
                );

            }
          );

          this.loading = false;

          this.cdr.detectChanges();

        },

        error: error => {

          console.error(
            'Error loading manage roles:',
            error
          );

          this.error =
            error?.error?.message ||
            'Failed to load departments and representatives.';

          this.loading = false;

          this.cdr.detectChanges();

        }

      });

  }


  /**
   * Get the user assigned to a department.
   */
  getAssignedUser(
    departmentId: number
  ): number | null {

    const user =
      this.representatives.find(
        representative =>
          representative.department_id ===
          departmentId
      );

    return user?.user_id ?? null;

  }


  /**
   * Get full name.
   */
  getFullName(
    user: Representative
  ): string {

    return [
      user.first_name,
      user.middle_name,
      user.last_name,
      user.extension_name
    ]
      .filter(Boolean)
      .join(' ');

  }


  /**
   * Assign / exchange users.
   */
  assignUser(
    department: Department,
    userId: number | null
  ): void {

    if (userId === null) {
      return;
    }


    const user =
      this.representatives.find(
        representative =>
          representative.user_id === userId
      );


    if (!user) {
      return;
    }


    /*
     * If already assigned to the same department.
     */
    if (
      user.department_id ===
      department.department_id
    ) {

      return;

    }


    const currentDepartment =
      user.department?.department_name;


    const targetDepartment =
      department.department_name;


    let title =
      'Assign User?';


    let confirmationText =
      `Assign ${this.getFullName(user)} to ${targetDepartment}?`;


    if (
      user.department_id !== null &&
      user.department_id !== undefined
    ) {

      title =
        'Exchange Users?';

      confirmationText =
        `${this.getFullName(user)} is currently assigned to ` +
        `${currentDepartment}. ` +
        `They will be exchanged with the user currently assigned to ` +
        `${targetDepartment}. Continue?`;

    }


    /*
     * IMPORTANT:
     *
     * Do NOT permanently change selectedUsers
     * until the user confirms.
     *
     * This prevents the dropdown from showing
     * the cancelled selection.
     */
    const previousUserId =
      this.selectedUsers[
        department.department_id
      ];


    Swal.fire({

      title,

      text: confirmationText,

      icon: 'question',

      showCancelButton: true,

      confirmButtonText:
        user.department_id !== null &&
        user.department_id !== undefined
          ? 'Yes, exchange'
          : 'Yes, assign',

      cancelButtonText: 'Cancel',

      reverseButtons: true

    })
    .then(result => {

      /*
       * User clicked Cancel.
       *
       * Restore the original value.
       */
      if (!result.isConfirmed) {

        this.selectedUsers[
          department.department_id
        ] = previousUserId;

        this.cdr.detectChanges();

        return;

      }


      this.saving = true;


      this.manageRoleService
        .assignUser(
          department.department_id,
          userId
        )
        .subscribe({

          next: response => {

            /*
             * Update selected department.
             */
            this.selectedUsers[
              department.department_id
            ] =
              response.user.user_id;


            /*
             * Update selected user locally.
             */
            user.department_id =
              response.department.department_id;

            user.department =
              response.department;


            /*
             * If another user was exchanged,
             * update that user's department.
             */
            if (
              response.previous_user
            ) {

              const previousUser =
                this.representatives.find(
                  representative =>
                    representative.user_id ===
                    response.previous_user!.user_id
                );


              if (previousUser) {

                previousUser.department_id =
                  response.previous_user!
                    .department_id;

                previousUser.department =
                  response.previous_user!
                    .department;

              }

            }


            /*
             * Refresh selectedUsers for every
             * department so the dropdowns remain
             * synchronized.
             */
            this.refreshSelectedUsers();


            this.saving = false;

            this.cdr.detectChanges();


            Swal.fire({

              icon: 'success',

              title:
                response.previous_user
                  ? 'Users Exchanged'
                  : 'User Assigned',

              text:
                response.message,

              timer: 1500,

              showConfirmButton: false

            });

          },


          error: error => {

            console.error(
              'Error assigning user:',
              error
            );


            /*
             * Restore previous dropdown value
             * if backend rejects the request.
             */
            this.selectedUsers[
              department.department_id
            ] = previousUserId;


            this.saving = false;

            this.cdr.detectChanges();


            Swal.fire({

              icon: 'error',

              title: 'Assignment Failed',

              text:
                error?.error?.message ||
                'Unable to assign this user.'

            });

          }

        });

    });

  }


  /**
   * Refresh dropdown values after
   * assignment/exchange.
   */
  refreshSelectedUsers(): void {

    this.selectedUsers = {};

    this.departments.forEach(
      department => {

        this.selectedUsers[
          department.department_id
        ] =
          this.getAssignedUser(
            department.department_id
          );

      }
    );

  }


  /**
   * Open Add User modal.
   */
  openAddUser(): void {

    this.addUserForm.reset();

    this.showAddUser = true;

    this.cdr.detectChanges();

  }


  /**
   * Close Add User modal.
   */
  closeAddUser(): void {

    if (this.addingUser) {
      return;
    }

    this.showAddUser = false;

    this.addUserForm.reset();

    this.cdr.detectChanges();

  }


  /**
   * Add new church representative.
   */
  submitAddUser(): void {

    if (
      this.addUserForm.invalid
    ) {

      this.addUserForm.markAllAsTouched();

      return;

    }


    const password =
      this.addUserForm.get(
        'password'
      )?.value;


    const passwordConfirmation =
      this.addUserForm.get(
        'password_confirmation'
      )?.value;


    /*
     * Check password confirmation.
     */
    if (
      password !==
      passwordConfirmation
    ) {

      Swal.fire({

        icon: 'warning',

        title: 'Passwords Do Not Match',

        text:
          'Please make sure both passwords are the same.'

      });

      return;

    }


    this.addingUser = true;


    this.manageRoleService
      .addUser(
        this.addUserForm.value
      )
      .subscribe({

        next: response => {

          /*
           * Add newly created user to the
           * representatives list immediately.
           */
          this.representatives.push(
            response.user
          );


          /*
           * Update department dropdown.
           */
          this.refreshSelectedUsers();


          this.addingUser = false;

          this.showAddUser = false;

          this.addUserForm.reset();

          this.cdr.detectChanges();


          Swal.fire({

            icon: 'success',

            title: 'User Added',

            text:
              response.message,

            timer: 1500,

            showConfirmButton: false

          });

        },


        error: error => {

          console.error(
            'Error adding user:',
            error
          );


          this.addingUser = false;

          this.cdr.detectChanges();


          /*
           * Laravel validation errors.
           */
          if (
            error?.error?.errors
          ) {

            const errors =
              error.error.errors;

            const messages =
              Object.values(errors)
                .flat()
                .join('\n');

            Swal.fire({

              icon: 'error',

              title: 'Unable to Add User',

              text: messages

            });

            return;

          }


          Swal.fire({

            icon: 'error',

            title: 'Unable to Add User',

            text:
              error?.error?.message ||
              'Something went wrong while creating the user.'

          });

        }

      });

  }


  /**
   * Check whether a form field
   * is invalid and touched.
   */
  isInvalid(
    controlName: string
  ): boolean {

    const control =
      this.addUserForm.get(
        controlName
      );

    return !!(
      control &&
      control.invalid &&
      control.touched
    );

  }

}