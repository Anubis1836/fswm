import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.development';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class HttpService {
  public serverName = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  /** Build fresh headers on every request so the latest token is used. */
  private createHeaders(): HttpHeaders {
    const authToken = this.authService.getToken();
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    if (authToken) headers = headers.set('Authorization', `Bearer ${authToken}`);
    return headers;
  }
  private opts() { return { headers: this.createHeaders() }; }

  // ----------------- USER -----------------
  registerUser(details: any): Observable<any> {
    return this.http.post(`${this.serverName}/api/user/register`, details);
  }

  /** No need to send auth header for login, but it's okay if present */
  login(details: any): Observable<any> {
    return this.http.post(`${this.serverName}/api/user/login`, details);
  }

  // ----------------- INSTITUTION -----------------
  createEvent(details: any): Observable<any> {
    return this.http.post(`${this.serverName}/api/institution/event`, details, this.opts());
  }

  updateEvent(eventId: any, details: any): Observable<any> {
    return this.http.put(`${this.serverName}/api/institution/event/${eventId}`, details, this.opts());
  }

  getEventByInstitutionId(institutionId: any): Observable<any> {
    return this.http.get(
      `${this.serverName}/api/institution/events?institutionId=${institutionId}`,
      this.opts()
    );
  }

  addResource(details: { eventId: any; [k: string]: any }): Observable<any> {
    return this.http.post(
      `${this.serverName}/api/institution/event/${details.eventId}/resource`,
      details,
      this.opts()
    );
  }

  GetAllProfessionals(): Observable<any> {
    return this.http.get(`${this.serverName}/api/institution/event/professionals`, this.opts());
  }

  assignProfessionals(eventId: any, userId: any): Observable<any> {
    return this.http.post(
      `${this.serverName}/api/institution/event/${eventId}/professional?userId=${userId}`,
      {},
      this.opts()
    );
  }

  // ----------------- PROFESSIONAL -----------------
  getEventByProfessional(userId: any): Observable<any> {
    return this.http.get(
      `${this.serverName}/api/professional/events?userId=${userId}`,
      this.opts()
    );
  }

  UpdateEventStatus(eventId: any, status: string): Observable<any> {
    return this.http.put(
      `${this.serverName}/api/professional/event/${eventId}/status?status=${encodeURIComponent(status)}`,
      {},
      this.opts()
    );
  }

  AddFeedback(eventId: any, userId: any, details: any): Observable<any> {
    return this.http.post(
      `${this.serverName}/api/professional/event/${eventId}/feedback?userId=${userId}`,
      details,
      this.opts()
    );
  }

  // ----------------- PARTICIPANT -----------------
  /** Alias kept for tests */
  GetAllevents(): Observable<any> {
    return this.http.get(`${this.serverName}/api/participant/events`, this.opts());
  }

  viewAllEvents(): Observable<any> {
    return this.http.get(`${this.serverName}/api/participant/events`, this.opts());
  }

  EnrollParticipant(eventId: any, userId: any): Observable<any> {
    return this.http.post(
      `${this.serverName}/api/participant/event/${eventId}/enroll?userId=${userId}`,
      {},
      this.opts()
    );
  }

  viewEventStatus(eventId: any): Observable<any> {
    return this.http.get(
      `${this.serverName}/api/participant/event/${eventId}/status`,
      this.opts()
    );
  }

  addFeedbackByParticipants(eventId: any, userId: any, details: any): Observable<any> {
    return this.http.post(
      `${this.serverName}/api/participant/event/${eventId}/feedback?userId=${userId}`,
      details,
      this.opts()
    );
  }


  getEventDetails(eventId: any): Observable<any> {
    return this.http.get(`${this.serverName}/api/events/${eventId}`, this.opts());
  }

  getEnrollments(eventId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.serverName}/api/events/${eventId}/enrollments`, this.opts());
  }


  checkEmailExists(email: string) {
    return this.http.get<boolean>(`${this.serverName}/api/user/exists/email?email=${email}`);
  }
   
  checkUsernameExists(username: string) {
    return this.http.get<boolean>(`${this.serverName}/api/user/exists/username?username=${username}`);
  }
   
  checkEventTitle(title: string, institutionId: string | null) {
    return this.http.post<{ exists: boolean }>(`${this.serverName}api/events/check-title`, {
      title,
      institutionId
    },
    this.opts()
    );
  }
  
   
}