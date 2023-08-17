import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import { LeaveBalance } from '../models/leave_balance.model';
import {Employee} from "../models/employee.model";
import { TokenController } from './token_controller';
import { Router } from '@angular/router';
import {Supervisors} from "../models/supervisors";


import {LeaveRequest} from "../models/leave_request.model";
import { SubordinatesReq } from '../models/subordinatesReq.model';

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

  getLeaveBalancesOfAnotherEmployee(employeeId:number):Observable<LeaveBalance[]> {
    const headers = this.createHeadersWithToken()
    return this.http.get<LeaveBalance[]>('url/api/employees/' + employeeId + '/balance', {headers, responseType:"json" as 'json'})
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

  getAllSupervisors(token:String):Observable<Supervisors[]>{
    const headers = this.createHeadersWithToken()
    return this.http.get<Supervisors[]>('url/api/employees/allSupervisors',{headers,responseType:"json" as "json"})
  }


  getAllSubordinates():Observable<Employee[]>{
    const headers = this.createHeadersWithToken()
    return this.http.get<Employee[]>('url/api/employees/all-subordinates', { headers, responseType: "text" as 'json' });
  }

  getEmployeeById(employeeId: number){
    const headers = this.createHeadersWithToken();
    return this.http.get<Employee>('url/api/employees/' + employeeId,{headers, responseType:"text" as "json"})
  }
}



