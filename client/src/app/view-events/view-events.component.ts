import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
 
@Component({
  selector: 'app-view-events',
  templateUrl: './view-events.component.html',
  styleUrls: ['./view-events.component.scss']
})
export class ViewEventsComponent implements OnInit {
 
  events: any[] = [];
  filteredEvents: any[] = [];
  uniqueLocations: string[] = []; // 👈 new list for dropdown options
 
  statusResults: { [key: string]: string } = {};
  errorMessage = '';
  searchQuery = '';
  selectedLocation = ''; // 👈 currently selected dropdown value
 
  constructor(private httpService: HttpService, public authService: AuthService, private router: Router) {}
 
  ngOnInit(): void {
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');
 
    const request$ = role === 'professional'
      ? this.httpService.getEventByProfessional(userId)
      : this.httpService.GetAllevents();
 
    request$.subscribe({
      next: (res: any) => {
        this.events = res || [];
        this.filteredEvents = [...this.events];
        this.uniqueLocations = [...new Set(this.events.map((e: any) => e.location))].filter(l => !!l);
      },
      error: () => (this.errorMessage = 'Failed to load events')
    });
  }
 
  // 🔍 called on typing in search
  onSearch(event: Event | string): void {
    let query = '';
    if (typeof event === 'string') query = event;
    else {
      const input = event.target as HTMLInputElement | null;
      query = input?.value || '';
    }
    this.searchQuery = query;
    this.applyFilters();
  }
 
  // 🗺️ called when location dropdown changes
  onLocationChange(event: Event): void {
    const select = event.target as HTMLSelectElement | null;
    const value = select?.value || '';
    this.selectedLocation = value;
   
    if (!value) {
      this.filteredEvents = [...this.events];
      return;
    }
   
    this.filteredEvents = this.events.filter(
      (ev) => (ev.location || '').toLowerCase() === value.toLowerCase()
    );
  }
   
 
  // 🔁 combine both filters (title + location)
  private applyFilters(): void {
    const q = this.searchQuery.toLowerCase().trim();
    const loc = this.selectedLocation.toLowerCase().trim();
 
    this.filteredEvents = this.events.filter(event => {
      const matchesTitle = (event.title || '').toLowerCase().includes(q);
      const matchesLocation = !loc || (event.location || '').toLowerCase() === loc;
      return matchesTitle && matchesLocation;
    });
  }
 
  checkStatus(eventId: any): void {
    this.httpService.viewEventStatus(eventId).subscribe({
      next: (res: any) => {
        const status = res && res.status ? res.status : res;
        this.statusResults[eventId] = status || 'Unknown';
      },
      error: () => {
        this.statusResults[eventId] = 'Error fetching status';
      }
    });
  }
 
  viewDetails(eventId: any): void {
    this.router.navigateByUrl(`/events/${eventId}`);
  }
 
  enroll(eventId: any): void {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.statusResults[eventId] = 'User not logged in';
      return;
    }
    this.httpService.EnrollParticipant(eventId, userId).subscribe({
      next: () => (this.statusResults[eventId] = 'Enrolled successfully'),
      error: () => (this.statusResults[eventId] = 'Enrollment failed')
    });
  }
}