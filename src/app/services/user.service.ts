import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import { Employee } from '../models/employee.model';
import {User} from "../models/user.model";


import {EmployeeUser} from "../models/employeeUser.model";
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private secretKey = CryptoJS.enc.Utf8.parse('ba6d59d38168f98b'); // Secret key

  constructor(private http:HttpClient) { }

  Login(username: string, password: string):Observable<any>{

    //encryption
    username = this.encryptData(username)
    password = this.encryptData(password)

    const credentials={username, password}

    const newHeaders = new HttpHeaders({ 'No-Auth':'True','Content-Type': 'application/json' });

    return this.http.post('url/api/auth/login', credentials,{headers:newHeaders, responseType: 'json'})
  }

  encryptData(data:String) {

    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), this.secretKey, {
        mode: CryptoJS.mode.ECB,
        format: CryptoJS.format.OpenSSL,
      }).toString();
    } catch (e) {
      console.log(e);
      return ''
    }
  }

  getUserData(token:string) {
    console.log(token)
    let tokenStr = "Bearer " + token;
    const headers = new HttpHeaders().set('Authorization',tokenStr);
    return this.http.get<User>('url/api/users/users_info',{headers,responseType: 'text' as 'json'});
  }

  getEmployeeDetails(token: string): Observable<Employee> {
    let tokenStr = "Bearer " + token;
    const headers = new HttpHeaders().set('Authorization', tokenStr);
    return this.http.get<Employee>('url/api/users/employee_info', { headers, responseType: "text" as 'json' });
  }

  postEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>('url/api/employees', employee);
  }
  saveEmployeeDetails(employee: Employee,token: string): Observable<Employee> {
    let tokenStr = "Bearer " + token;
    const headers = new HttpHeaders().set('Authorization', tokenStr);
    const url='url/api/employees/'+employee.employeeId+"/changeProfile";
    return this.http.put<Employee>(url, employee, {headers,responseType:"text" as 'json'});

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
