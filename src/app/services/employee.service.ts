import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import { User } from '../models/user.model';
import { LeadingComment } from '@angular/compiler';
import { LeaveRequest } from '../models/leave_request.model';
import { LeaveBalance } from '../models/leave_balance.model';
import * as CryptoJS from 'crypto-js';



@Injectable({
  providedIn: 'root'
})
export class EmployeeService {



  private currentUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http:HttpClient) { }

  
  getTakenLeaves(username:string, password:string):Observable<LeaveBalance[]>
  {
    
    
    
    const credentials = btoa(`${username}:${password}`);
    const headers = new HttpHeaders({ Authorization: `Basic ${credentials}`, 'Content-Type': 'application/json' });

    console.log(headers)
    return this.http.get<LeaveBalance[]>('url/api/employees/balance', {headers})
  }

}
