import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { map, debounceTime, switchMap, distinctUntilChanged } from 'rxjs/operators';
import { of } from 'rxjs';
 
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  itemForm!: FormGroup;
  successMessage = '';
  errorMessage = '';
 
  passwordRules = {
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    minLength: false
  };
 
  constructor(private fb: FormBuilder, private httpService: HttpService) {}
 
  ngOnInit(): void {
    this.itemForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(6)], [this.usernameExistsValidator()]],
      email: ['', [Validators.required, Validators.email], [this.emailExistsValidator()]],
      password: ['', [Validators.required]],
      role: [null, Validators.required]
    });
 
    // Track password changes
    this.itemForm.get('password')?.valueChanges.subscribe(value => this.validatePassword(value));
  }
 
  validatePassword(value: string) {
    this.passwordRules.hasUpperCase = /[A-Z]/.test(value);
    this.passwordRules.hasLowerCase = /[a-z]/.test(value);
    this.passwordRules.hasNumber = /[0-9]/.test(value);
    this.passwordRules.hasSpecialChar = /[*&#^%@!]/.test(value);
    this.passwordRules.minLength = value.length >= 8;
  }
 
  emailExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) return of(null);
      return of(control.value).pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(email => this.httpService.checkEmailExists(email)),
        map(exists => (exists ? { emailExists: true } : null))
      );
    };
  }
 
  usernameExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) return of(null);
      return of(control.value).pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(username => this.httpService.checkUsernameExists(username)),
        map(exists => (exists ? { usernameExists: true } : null))
      );
    };
  }
 
  register() {
    if (this.itemForm.invalid || !Object.values(this.passwordRules).every(v => v)) {
      this.errorMessage = 'Please fix validation errors';
      return;
    }
 
    this.httpService.registerUser(this.itemForm.value).subscribe({
      next: () => {
        this.successMessage = 'Registration successful';
        this.errorMessage = '';
      },
      error: (err) => {
        // Show backend error near the appropriate field
        if (err?.error?.field === 'username') {
          this.f['username'].setErrors({ serverError: err.error.message });
        } else if (err?.error?.field === 'email') {
          this.f['email'].setErrors({ serverError: err.error.message });
        } else {
          this.errorMessage = err?.error?.message || 'Registration failed';
        }
      }
    });
}
 
  get f() { return this.itemForm.controls; }
}
 