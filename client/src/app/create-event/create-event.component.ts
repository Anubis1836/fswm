import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { map, catchError, of } from 'rxjs';
 
@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss']
})
export class CreateEventComponent implements OnInit {
  itemForm!: FormGroup;
  successMessage = '';
  errorMessage = '';
 
  constructor(private fb: FormBuilder, private httpService: HttpService) {}
 
  ngOnInit(): void {
    const institutionId = localStorage.getItem('userId');
 
    this.itemForm = this.fb.group({
      title: [
        '',
        [Validators.required, Validators.minLength(5), Validators.maxLength(80)],
        [this.titleExistsValidator(institutionId)]
      ],
      schedule: ['', Validators.required],
      location: ['', [Validators.required, Validators.minLength(3)]],
      status: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      institutionId: [institutionId]
    });
  }
 
  get f() {
    return this.itemForm.controls;
  }
 
  titleExistsValidator(institutionId: string | null): AsyncValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) return of(null);
      return this.httpService.checkEventTitle(control.value, institutionId).pipe(
        map(res => (res.exists ? { titleTaken: true } : null)),
        catchError(() => of(null))
      );
    };
  }
 
  submit() {
    this.successMessage = '';
    this.errorMessage = '';
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }
    const { title, institutionId } = this.itemForm.value;
    this.httpService.checkEventTitle(title, institutionId).subscribe({
      next: (res) => {
        if (res.exists) {
          this.errorMessage = 'An event with this title already exists for this institution.';
          this.successMessage = '';
        }}
      })
    this.httpService.createEvent(this.itemForm.value).subscribe({
      next: () => (this.successMessage = '✅ Event created successfully.'),
      error: err => (this.errorMessage = err.error?.message || 'An event with this title already exists for this institution.')
    });
    // ✅ Step 1: Check if event already exists before creating
    // this.httpService.checkEventTitle(title, institutionId).subscribe({
    //   next: (res) => {
    //     if (res.exists) {
    //       this.errorMessage = 'An event with this title already exists for this institution.';
    //       this.successMessage = '';
    //     } else {
    //       // ✅ Step 2: Proceed to create event
    //       this.httpService.createEvent(this.itemForm.value).subscribe({
    //         next: () => {
    //           this.successMessage = 'Event created successfully';
    //           this.errorMessage = '';
    //           this.itemForm.reset();
    //         },
    //         error: (err) => {
    //           this.errorMessage = err?.error?.message || 'Failed to create event';
    //           this.successMessage = '';
    //         }
    //       });
    //     }
    //   },
    //   error: () => {
    //     this.errorMessage = 'Failed to validate event title';
    //   }
    // });
  }
}
 