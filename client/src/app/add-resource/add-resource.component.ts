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
 
// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { HttpService } from '../../services/http.service';
// import { AuthService } from '../../services/auth.service';
 
// @Component({
//   selector: 'app-add-resource',
//   templateUrl: './add-resource.component.html',
//   styleUrls: ['./add-resource.component.scss']
// })
// export class AddResourceComponent implements OnInit {
//   itemForm!: FormGroup;
//   events: any[] = [];
//   selectedFile: File | null = null;
//   successMessage: string = '';
//   errorMessage: string = '';
 
//   constructor(
//     private fb: FormBuilder,
//     private httpService: HttpService,
//     private authService: AuthService
//   ) {}
 
//   ngOnInit(): void {
//     this.itemForm = this.fb.group({
//       eventId: [null, Validators.required],
//       type: ['', Validators.required],
//       description: ['', Validators.required],
//       availabilityStatus: ['Available', Validators.required]
//     });

 
//     this.loadEvents();
//   }
  
//   get f() {
//     return this.itemForm.controls;
//   }
 
//   loadEvents(): void {
//     const institutionId = localStorage.getItem('userId') 
//     this.httpService.getEventByInstitutionId(institutionId).subscribe({
//       next: (res) => (this.events = res),
//       error: () => (this.errorMessage = 'Failed to load events')
//     });
//   }
 
//   onFileSelected(event: any): void {
//     const file = event.target.files[0];
//     if (file) {
//       this.selectedFile = file;
//     }
//   }
 
//   submit(): void {
//     if (this.itemForm.invalid || !this.selectedFile) {
//       this.errorMessage = 'Please fill all fields and select a file.';
//       return;
//     }
 
//     const formData = new FormData();
//     formData.append('file', this.selectedFile!);
//     formData.append('eventId', this.itemForm.value.eventId);
//     formData.append('type', this.itemForm.value.type);
//     formData.append('description', this.itemForm.value.description);
//     formData.append('availabilityStatus', this.itemForm.value.availabilityStatus);
 
//     this.httpService.uploadResource(formData).subscribe({
//       next: () => {
//         this.successMessage = 'Resource uploaded successfully!';
//         this.errorMessage = '';
//         this.itemForm.reset();
//         this.selectedFile = null;
//       },
//       error: (err) => {
//         console.error(err);
//         this.errorMessage = 'Failed to upload resource';
//         this.successMessage = '';
//       }
//     });
//   }
// }
 