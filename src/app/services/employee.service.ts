import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {LeaveBalance} from '../models/leave_balance.model';
import {Employee} from "../models/employee.model";
import {TokenController} from './token_controller';
import {Router} from '@angular/router';
import {Supervisors} from "../models/supervisors";

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

  getAllEmployees():Observable<Employee[]> {
    const headers = this.createHeadersWithToken()
    return this.http.get<Employee[]>('url/api/employees', { headers, responseType: "text" as 'json' });
  }

  getLeaveBalancesOfAnotherEmployee(employeeId:number):Observable<LeaveBalance[]> {
    const headers = this.createHeadersWithToken()
    return this.http.get<LeaveBalance[]>('url/api/employees/' + employeeId + '/balance', {headers, responseType:"json" as 'json'})
  }

  getEmployeesWithoutUser(){
    const url = 'url/api/employees/withoutAccount';
    const headers = this.createHeadersWithToken();
    return this.http.get<Employee[]>(url,{headers, responseType: 'text' as 'json'});
  }

  addNewEmployee(newEmployee: Employee) {
    const headers = this.createHeadersWithToken();
    return this.http.post<Employee>('url/api/employees', newEmployee, {headers, responseType: "text" as "json"});
  }

  addNewLeaveBalanceToEmployee(employeeId: number, newLeaveBalance: LeaveBalance){
    const headers = this.createHeadersWithToken();
    return this.http.post<LeaveBalance>('url/api/employees/' + employeeId + '/leavebalance', newLeaveBalance, {headers, responseType: "text" as "json"});
  }

  getAllSupervisors():Observable<Supervisors[]>{
    const headers = this.createHeadersWithToken()
    return this.http.get<Supervisors[]>('url/api/employees/allSupervisors',{headers,responseType:"text" as "json"})
  }

  getAllSubordinates():Observable<Employee[]>{
    const headers = this.createHeadersWithToken()
    return this.http.get<Employee[]>('url/api/employees/all-subordinates', { headers, responseType: "text" as 'json' });
  }

  getDirectSubordinates():Observable<Employee[]>{
    const headers = this.createHeadersWithToken()
    return this.http.get<Employee[]>('url/api/employees/direct-subordinates', { headers, responseType: "text" as 'json' });
  }

  getEmployeeById(employeeId: number){
    const headers = this.createHeadersWithToken();
    return this.http.get<Employee>('url/api/employees/' + employeeId,{headers, responseType:"text" as "json"})
  }

  editLeaveBalanceOfEmployee(employeeId: number, leaveBalance: LeaveBalance){
    const headers = this.createHeadersWithToken();
    return this.http.put<LeaveBalance>('url/api/employees/' + employeeId + '/leavebalance', leaveBalance, {headers, responseType:"text" as "json"})
  }

  deleteLeaveBalanceOfEmployee(employeeId: number, leaveBalanceId: number){
    const headers = this.createHeadersWithToken();
    const url = 'url/api/employees/' + employeeId + '/leavebalance/' + leaveBalanceId;
    return this.http.delete<LeaveBalance>(url, {headers, responseType: "text" as "json"});
  }

  getFilterSupervisors(employeeId: number){
    const headers = this.createHeadersWithToken();
    return this.http.get<Supervisors[]>('url/api/employees/' + employeeId + '/filtered-supervisors', {headers, responseType: "text" as "json"});
  }
}
