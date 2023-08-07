import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import { Employee } from '../models/employee.model';
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
    let tokenStr = "Bearer " + token
    const headers = new HttpHeaders().set('Authorization',tokenStr)
    return this.http.get<String>('url/api/users/info',{headers,responseType: 'text' as 'json'})
  }

  getEmployeeDetails():Observable<Employee>{
    return this.http.get<Employee>('url/api/employee')
  }
  postEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>('url/api/employee', employee);
  }
  saveEmployeeDetails(employee: Employee): Observable<Employee> {
    const url='url/api/employee/${employee.id}'
    return this.http.put<Employee>(url, employee)

  }
  getEmployeeRestLeaves(employee: Employee):Observable<Employee>{
    const url='url/api/${employee.id}/leavebalance'
    return this.http.get<Employee>(url)
  }

}