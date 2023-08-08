import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import { Employee } from '../models/employee.model';
import {EmployeeUser} from "../models/employeeUser.model";

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

  Login(username: string, password: string):Observable<any>{
    const credentials={username,password}
    const newHeaders = new HttpHeaders({ 'No-Auth':'True','Content-Type': 'application/json' });
    console.log(credentials)

    return this.http.post('url/api/auth/login', credentials,{headers:newHeaders, responseType: 'json'})

  }

  getUserData(token:string) {
    console.log(token)
    let tokenStr = "Bearer " + token;
    const headers = new HttpHeaders().set('Authorization',tokenStr);
    return this.http.get<String>('url/api/users/users_info',{headers,responseType: 'text' as 'json'});
  }

  getEmployeeDetails(token: string): Observable<Employee> {
    let tokenStr = "Bearer " + token;
    const headers = new HttpHeaders().set('Authorization', tokenStr);
    return this.http.get<Employee>('url/api/users/employee_info', { headers, responseType: "text" as 'json' });
  }

  postEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>('url/api/employees', employee);
  }
  saveEmployeeDetails(employee: Employee): Observable<Employee> {
    const url='url/api/employees/${employee.id}'
    return this.http.put<Employee>(url, employee)

  }
  getEmployeeRestLeaves(employee: Employee):Observable<Employee>{
    const url='url/api/${employee.id}/leavebalance'
    return this.http.get<Employee>(url)
  }

  getUserEmployeeDetails(token: string, username: string):Observable<EmployeeUser>{
    let tokenStr = "Bearer " + token;
    const url = 'url/api/users/admin/' + username;
    const headers = new HttpHeaders().set('Authorization', tokenStr);
    return this.http.get<EmployeeUser>(url, {headers, responseType: 'text' as 'json'});
  }

  getAllUserEmployees(token: string){
    let tokenStr = "Bearer " + token;
    const url = 'url/api/users/admin/all-users';
    const headers = new HttpHeaders().set('Authorization', tokenStr);
    return this.http.get<EmployeeUser>(url, {headers, responseType: 'text' as 'json'});
  }

}
