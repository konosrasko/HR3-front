import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import { User } from '../models/user.model';
import { LeadingComment } from '@angular/compiler';
import { LeaveRequest } from '../models/leave_request.model';
import { LeaveBalance } from '../models/leave_balance.model';
import * as CryptoJS from 'crypto-js';
import { AppComponent } from '../app.component';
import {Employee} from "../models/employee.model";
import { TokenController } from './token_controller';
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class EmployeeService extends TokenController{

  constructor(private http:HttpClient, router: Router) {
    super(router)
  }

  getLeaveBalances():Observable<LeaveBalance[]> {
    const headers = this.createHeadersWithToken()
    return this.http.get<LeaveBalance[]>('url/api/employees/balance', {headers, responseType:"json" as 'json'})
  }

  getAllEmployees(token:String):Observable<Employee[]> {
    const headers = this.createHeadersWithToken()
    return this.http.get<Employee[]>('url/api/employees', { headers, responseType: "text" as 'json' });
  }

  getEmployeesWithoutUser(token?: string){
    let tokenStr = "Bearer " + token;
    const url = 'url/api/employees/withoutAccount';
    const headers = new HttpHeaders().set('Authorization', tokenStr);
    return this.http.get<Employee[]>(url,{headers, responseType: 'text' as 'json'});
  }

  addEmployee(employee: Employee, token: String): void {
    let tokenStr = 'Bearer ' + token;
    const headers = new HttpHeaders().set('Authorization', tokenStr);
    this.http.post<Employee>('url/api/employees', employee, { headers }).subscribe(
      (response) => {
        console.log('Employee added successfully:', response);
      },
      (error) => {
        console.error('Error adding employee:', error);

      }
    );
  }
}
