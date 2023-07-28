import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import { User } from '../models/user.model';



@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  
  public setCurrentUser(user: any): void {
    this.currentUserSubject.next(user);
  }


  constructor(private http:HttpClient) { }

  Login(username: string, password: string) {

    const credentials = btoa(`${username}:${password}`);
    const headers = new HttpHeaders({ Authorization: `Basic ${credentials}`, 'Content-Type': 'application/json' });
    //console.log(headers);

    // Make the HTTP request with the provided headers
    return this.http.get('url/api/users/info', { headers });
  }

  
  getData():Observable<User>
  {
    return this.http.get<User>('url/api/users/info')
  }

}
