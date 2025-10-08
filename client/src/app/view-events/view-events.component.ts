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
  paginatedEvents: any[] = [];
  uniqueLocations: string[] = [];
 
  statusResults: { [key: string]: string } = {};
  errorMessage = '';
  searchQuery = '';
  selectedLocation = '';
 
  // 📄 Pagination
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
 
  constructor(
    private httpService: HttpService,
    public authService: AuthService,
    private router: Router
  ) {}
 
  ngOnInit(): void {
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');
 
    const request$ =
      role === 'professional'
        ? this.httpService.getEventByProfessional(userId)
        : this.httpService.GetAllevents();
 
    request$.subscribe({
      next: (res: any) => {
        this.events = res || [];
        this.filteredEvents = [...this.events];
        this.uniqueLocations = [...new Set(this.events.map((e: any) => e.location))].filter(
          (l) => !!l
        );
        this.updatePagination();
      },
      error: () => (this.errorMessage = 'Failed to load events')
    });
  }
 
  onSearch(event: Event | string): void {
    let query = '';
    if (typeof event === 'string') query = event;
    else query = (event.target as HTMLInputElement)?.value || '';
    this.searchQuery = query;
    this.applyFilters();
  }
 
  onLocationChange(event: Event): void {
    const select = event.target as HTMLSelectElement | null;
    this.selectedLocation = select?.value || '';
    this.applyFilters();
  }
 
  private applyFilters(): void {
    const q = this.searchQuery.toLowerCase().trim();
    const loc = this.selectedLocation.toLowerCase().trim();
 
    this.filteredEvents = this.events.filter((event) => {
      const matchesTitle = (event.title || '').toLowerCase().includes(q);
      const matchesLocation = !loc || (event.location || '').toLowerCase() === loc;
      return matchesTitle && matchesLocation;
    });
 
    this.currentPage = 1;
    this.updatePagination();
  }
 
  // 📄 Pagination Logic
  private updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredEvents.length / this.pageSize);
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedEvents = this.filteredEvents.slice(start, end);
  }
 
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }
 
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }
 
  // 🧮 User changes page size
  onPageSizeChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const newSize = Number(input.value);
    this.pageSize = newSize > 0 ? newSize : 1;
    this.currentPage = 1;
    this.updatePagination();
  }
 
  // ✅ Event Actions
  checkStatus(eventId: any): void {
    this.httpService.viewEventStatus(eventId).subscribe({
      next: (res: any) => {
        const status = res && res.status ? res.status : res;
        this.statusResults[eventId] = status || 'Unknown';
      },
      error: () => (this.statusResults[eventId] = 'Error fetching status')
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
 