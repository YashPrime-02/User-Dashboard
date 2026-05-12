import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { User } from '../../models/user';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './user-form.html',
  styleUrls: ['./user-form.scss']
})
export class UserFormComponent
implements OnInit {

  /*
    Existing user for edit mode
  */
  @Input()
  existingUser: User | null = null;

  /*
    Emits newly created
    or updated user
  */
  @Output()
  userAdded =
    new EventEmitter<User>();

  /*
    Emits close modal event
  */
  @Output()
  closeModal =
    new EventEmitter<void>();

  /*
    Reactive form group
  */
  userForm: FormGroup;

  /*
    Available roles
  */
  roles = [
    'Admin',
    'Editor',
    'Viewer'
  ];

  constructor(
    private fb: FormBuilder
  ) {

    /*
      Initialize form
    */
    this.userForm =
      this.fb.group({

        name: [
          '',
          [
            Validators.required,
            Validators.minLength(3)
          ]
        ],

        email: [
          '',
          [
            Validators.required,
            Validators.email
          ]
        ],

        role: [
          '',
          Validators.required
        ]
      });
  }

  /*
    Prefill form during edit mode
  */
  ngOnInit(): void {

    if (this.existingUser) {

      this.userForm.patchValue({

        name:
          this.existingUser.name,

        email:
          this.existingUser.email,

        role:
          this.existingUser.role
      });
    }
  }

  /*
    Submit form
  */
  onSubmit(): void {

    /*
      Prevent invalid submit
    */
    if (this.userForm.invalid) {

      this.userForm.markAllAsTouched();

      return;
    }

    /*
      Emit valid user data
    */
    this.userAdded.emit(
      this.userForm.value
    );

    /*
      Close modal
    */
    this.closeModal.emit();
  }

  /*
    Close popup manually
  */
  onClose(): void {

    this.closeModal.emit();
  }

  /*
    Helper for template validation
  */
  get formControls() {

    return this.userForm.controls;
  }
}