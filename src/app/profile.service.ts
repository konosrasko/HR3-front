import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profile } from './profile.model'; // Replace 'User' with your user model interface

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://localhost:8080/api/employees/profile'; 
  private basicAuthCredentials: string;

  constructor(private http: HttpClient) {
    const username = 'pamvrosiadis'; 
    const password = '123';
    this.basicAuthCredentials = btoa(`${username}:${password}`);
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Basic ${this.basicAuthCredentials}`,
      'Content-Type': 'application/json'
    });
  }

  myProfile(): Observable<Profile> {
    return this.http.get<Profile>(this.apiUrl, { headers: this.getHeaders() });
  }

  // Add more methods for different HTTP requests (e.g., POST, PUT, DELETE) as needed
}