import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-dashbaord',
  templateUrl: './dashbaord.component.html',
  styleUrls: ['./dashbaord.component.scss'],
})
export class DashbaordComponent implements OnInit{
  totalEvents: number = 0;
  totalParticipants: number = 0;
  totalProfessionals: number = 0;
  totalFeedback: number = 0;
  recentEvents: any[] = [];
  public events: any;
  participants: any[] = [];
  
  constructor(public authService: AuthService, public http: HttpService) {
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.http.getEventByInstitutionId(localStorage.getItem('userId')).subscribe((res) => {
      // console.log(res);
      this.events = res;
      this.totalEvents = res.length;
      this.recentEvents = res.slice(0,4);
      for(let i=0; i<this.totalEvents; i++) {
        this.http.getEnrollments(this.events[i].id).subscribe((res2) => {
          
          this.participants = res2;
          this.totalParticipants += this.participants.length;
        });
        this.http.getEventDetails(this.events[i].id).subscribe((res) => {
          this.totalFeedback += res.feedbacks.length;
        })
      }
    });


    
    this.http.GetAllProfessionals().subscribe((res) => {
      this.totalProfessionals = res.length;
    })

    
  }
  
}