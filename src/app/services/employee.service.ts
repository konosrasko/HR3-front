import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import { User } from '../models/user.model';
import { LeadingComment } from '@angular/compiler';
import { LeaveRequest } from '../models/leave_request.model';
import { LeaveBalance } from '../models/leave_balance.model';
import * as CryptoJS from 'crypto-js';
import { AppComponent } from '../app.component';



@Injectable({
  providedIn: 'root'
})
export class EmployeeService{

  constructor(private http:HttpClient) {
  }
  
  getTakenLeaves():Observable<LeaveBalance[]>
  {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    return this.http.get<LeaveBalance[]>('url/api/employees/balance', {headers, responseType:"json" as 'json'})
  }


  getToken():string{
    const token = localStorage.getItem('token');

    if(token)
      return token;
    else {
      alert("Your session has expired");
      return ""
    }
  }
}
