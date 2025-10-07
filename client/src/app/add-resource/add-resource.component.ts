import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';
 
@Component({
  selector: 'app-add-resource',
  templateUrl: './add-resource.component.html',
  styleUrls: ['./add-resource.component.scss']
})
export class AddResourceComponent implements OnInit {
  itemForm!: FormGroup;
  events: any[] = [];
  successMessage = '';
  errorMessage = '';
 
  constructor(private fb: FormBuilder, private httpService: HttpService) {}
 
  ngOnInit(): void {
    this.itemForm = this.fb.group({
      eventId: [null, Validators.required],
      type: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      availabilityStatus: [null, Validators.required]
    });
 
    this.loadEvents();
  }
 
  get f() {
    return this.itemForm.controls;
  }
 
  loadEvents() {
    this.httpService.getEventByInstitutionId(1).subscribe({
      next: (res) => (this.events = res),
      error: () => (this.errorMessage = 'Failed to load events')
    });
  }
 
  submit() {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }
 
    this.httpService.addResource(this.itemForm.value).subscribe({
      next: () => {
        this.successMessage = 'Resource added successfully';
        this.errorMessage = '';
        this.itemForm.reset();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Failed to add resource';
        this.successMessage = '';
      }
    });
  }
}
 