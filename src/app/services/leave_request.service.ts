import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {LeaveBalance } from '../models/leave_balance.model';
import { LeaveRequest } from '../models/leave_request.model';
import { TokenController } from './token_controller';
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class LeaveRequestService extends TokenController{

  constructor(private http:HttpClient, router:Router) {
    super(router);
  }
  
  getLeaveRequestHistory():Observable<LeaveBalance[]>
  {
    const headers = this.createHeadersWithToken();
    return this.http.get<LeaveBalance[]>('url/api/leaverequests/all', {headers, responseType:"json" as 'json'})
  }

  newLeaveRequest(newLeaveRequest: LeaveRequest) {
    const headers = this.createHeadersWithToken();
    return this.http.post<LeaveRequest>('url/api/employees/leaverequests/add', newLeaveRequest, {headers, responseType:"json" as 'json'})
  }

  newLeaveRequestForAnotherEmployee(newLeaveRequest: LeaveRequest, employeeId: number) {
    const headers = this.createHeadersWithToken();
    return this.http.post<LeaveRequest>('url/api/employees/' + employeeId + '/leaverequests/add', newLeaveRequest, {headers, responseType:"json" as 'json'})
  }

  deleteLeaveRequest(leaveRequestId: number): Observable<LeaveRequest>{
    const headers = this.createHeadersWithToken()
    return this.http.delete<LeaveRequest>(`url/api/leaverequests/${leaveRequestId}`, {headers, responseType:"json" as 'json'})
  }

}
