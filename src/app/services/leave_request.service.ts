import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {LeaveBalance} from '../models/leave_balance.model';
import {LeaveRequest} from '../models/leave_request.model';
import {TokenController} from './token_controller';
import {Router} from '@angular/router';
import {SubordinatesReq} from '../models/subordinatesReq.model';


@Injectable({
  providedIn: 'root'
})
export class LeaveRequestService extends TokenController{

  constructor(private http:HttpClient, router:Router) {
    super(router);
  }

  getLeaveRequest(leaveId: number):Observable<LeaveRequest>{
    const headers = this.createHeadersWithToken();
    return this.http.get<LeaveRequest>(`url/api/leaverequests/${leaveId}`, {headers, responseType:"json" as 'json'})
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

  editLeaveRequest(editedLeaveRequest: LeaveRequest) {
    const headers = this.createHeadersWithToken();
    return this.http.put<LeaveRequest>('url/api/leaverequests', editedLeaveRequest, {headers, responseType:"json" as 'json'})
  }

  getDirectSubordinatesReq(){
    const url = 'url/api/leaverequests/direct-subordinates';
    const headers = this.createHeadersWithToken();
    return this.http.get<SubordinatesReq>(url,{headers,responseType:'text' as 'json'});
  }

  getAllSubordinatesReq(){
    const url = 'url/api/leaverequests/all-subordinates';
    const headers = this.createHeadersWithToken();
    return this.http.get<SubordinatesReq>(url,{headers,responseType:'text' as 'json'});
  }

  approveLeaveRequest(leaveId: number ){
    const headers = this.createHeadersWithToken()
    return this.http.put<LeaveRequest>(`url/api/employees/${leaveId}/approve` ,{},{headers, responseType:'json' as 'json'})
  }

  declineLeaveRequest(leaveId: number){
    const headers = this.createHeadersWithToken()
    return this.http.put<LeaveRequest>(`url/api/employees/${leaveId}/decline` ,{},{headers, responseType:'json' as 'json'})
  }

  newLeaveRequestForAnotherEmployee(newLeaveRequest: LeaveRequest, employeeId: number) {
    const headers = this.createHeadersWithToken();
    return this.http.post<LeaveRequest>('url/api/employees/' + employeeId + '/leaverequests/add', newLeaveRequest, {headers, responseType:"json" as 'json'})
  }

  deleteLeaveRequest(leaveRequestId: number): Observable<LeaveRequest>{
    const headers = this.createHeadersWithToken()
    return this.http.delete<LeaveRequest>(`url/api/leaverequests/${leaveRequestId}`, {headers, responseType:"json" as 'json'})
  }

  getCalendarLeaveRequests(): Observable<LeaveRequest[]> {
    const headers = this.createHeadersWithToken();
    return this.http.get<LeaveRequest[]>('url/api/leaverequests/all', { headers, responseType: "json" as "json" });
  }
}
