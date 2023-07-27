import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {EmployeeModel} from "../employee/employee.model";



@Injectable({
  providedIn: 'root'
})
export class EmployeeService {


  constructor(private http:HttpClient) { }

  Login(username: string, password: string) {

    const credentials = btoa(`${username}:${password}`);

    const headers = new HttpHeaders({ Authorization: `Basic ${credentials}`, 'Content-Type': 'application/json' });

    console.log(headers);



    // Make the HTTP request with the provided headers

    return this.http.get('/url/api/employees/profile', { headers });


  }
  getEmployees():Observable<EmployeeModel>
  {

    return this.http.get<EmployeeModel>('/url/api/employees/profile')
  }



}
