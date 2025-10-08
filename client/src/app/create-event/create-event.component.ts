import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';
 
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
    this.itemForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      schedule: ['', Validators.required],
      location: ['', Validators.required],
      status: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      institutionId: [localStorage.getItem('userId')]
    });
  }

  get f() {
    return this.itemForm.controls;
  }
 
  submit() {
    if (this.itemForm.invalid) return;
 
    const { title, institutionId } = this.itemForm.value;
 
    // ✅ Step 1: Check if event already exists before creating
    this.httpService.checkEventTitle(title, institutionId).subscribe({
      next: (res) => {
        if (res.exists) {
          this.errorMessage = 'An event with this title already exists for this institution.';
          this.successMessage = '';
        } else {
          // ✅ Step 2: Proceed to create event
          this.httpService.createEvent(this.itemForm.value).subscribe({
            next: () => {
              this.successMessage = 'Event created successfully';
              this.errorMessage = '';
              this.itemForm.reset();
            },
            error: (err) => {
              this.errorMessage = err?.error?.message || 'Failed to create event';
              this.successMessage = '';
            }
          });
        }
      },
      error: () => {
        this.errorMessage = 'Failed to validate event title';
      }
    });
  }
}
 