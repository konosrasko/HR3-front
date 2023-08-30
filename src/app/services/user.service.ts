import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Employee} from '../models/employee.model';
import {User} from '../models/user.model';
import {EmployeeUser} from "../models/employeeUser.model";
import * as CryptoJS from 'crypto-js';
import {TokenController} from './token_controller';
import {Router} from '@angular/router';
import {Roles} from '../models/roles.model';

@Injectable({
  providedIn: 'root'
})
export class UserService extends TokenController {

  private secretKey = CryptoJS.enc.Utf8.parse('ba6d59d38168f98b'); // Secret key
  private  username:string =''
  private  password:string = ''
  private static credentials:{username:any,password:any,token:any}



  constructor(private http: HttpClient, router: Router) {
    super(router);
  }


  Login(username: string, password: string): Observable<any> {
    const now = new Date();
    this.username = username;
    this.password = password;

    //encryption
    username = this.encryptData(username);
    password = this.encryptData(password);

    localStorage.setItem('username',username);
    localStorage.setItem('password',password);
    localStorage.setItem('loginTime', now.getTime().toString());

    const credentials = { username, password }

    const newHeaders = new HttpHeaders({ 'No-Auth': 'True', 'Content-Type': 'application/json' });

    return this.http.post('url/api/auth/login', credentials, { headers: newHeaders, responseType: 'json' })
  }

  Logout(): Observable<string> {

    const headers = this.createHeadersWithToken();
    const token= localStorage.getItem('token')

    UserService.credentials={username:localStorage.getItem('username'),password:localStorage.getItem('password'),token:token}


    UserService.credentials.username = this.decryptData(UserService.credentials.username)
    UserService.credentials.password = this.decryptData(UserService.credentials.password)


    const inputString = UserService.credentials.username
    const modifiedString = inputString.replace(/"([^"]*)"/g, '$1');
    UserService.credentials.username = modifiedString


    const inputStringpas = UserService.credentials.password
    const modifiedStringpas = inputStringpas.replace(/"([^"]*)"/g, '$1');
    UserService.credentials.password = modifiedStringpas

    return this.http.post('url/api/auth/logout', UserService.credentials, {
      headers: headers,
      responseType: 'arraybuffer'
    }).pipe(map(response => {
      // Convert the ArrayBuffer to a string
      const textDecoder = new TextDecoder('utf-8');
      const responseString = textDecoder.decode(response);
      localStorage.clear();
      UserService.credentials.username =''
      UserService.credentials.password =''
      UserService.credentials.token =''

      this.getRouter()?.navigate(["/login"], {queryParams: {error: "Η συνεδρία σας έληξε, παρακαλώ ξανασυνδεθείτε.", tokenExpired: false}})
      return responseString;
    }));

  }

  encryptData(data:String):string {

    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), this.secretKey, {
        mode: CryptoJS.mode.ECB,
        format: CryptoJS.format.OpenSSL,
      }).toString();
    } catch (e) {
      return ''
    }
  }

  decryptData(data: string): string {
    try {
      const decryptedBytes = CryptoJS.AES.decrypt(data, this.secretKey, {
        mode: CryptoJS.mode.ECB,
        format: CryptoJS.format.OpenSSL,
      });
      const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
      return decryptedText;
    } catch (e) {
      return 'lathos';
    }
  }

  getUserRoles():Observable<Roles>{
    const headers:HttpHeaders = this.createHeadersWithToken()
    return this.http.get<Roles>('url/api/users/roles', {headers, responseType:"json" as 'json'})
  }

  getUserDetails() {
    const headers = this.createHeadersWithToken()
    return this.http.get<User>('url/api/users/user_info', { headers, responseType: 'json' as 'json' });
  }

  getEmployeeDetails(): Observable<Employee> {
    const headers = this.createHeadersWithToken()
    return this.http.get<Employee>('url/api/users/employee_info', { headers, responseType: "text" as 'json' });
  }

  postEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>('url/api/employees', employee);
  }
  saveEmployeeDetails(employee: Employee): Observable<Employee> {
    const headers = this.createHeadersWithToken()
    return this.http.put<Employee>('url/api/employees/' + employee.employeeId + "/changeProfile", employee, { headers, responseType: "text" as 'json' });

  }
  getEmployeeRestLeaves(employee: Employee): Observable<Employee> {
    const url = 'url/api/${employee.id}/leavebalance';
    return this.http.get<Employee>(url);
  }

  getUserEmployeeDetails(userId: number): Observable<EmployeeUser> {
    const headers = this.createHeadersWithToken();
    return this.http.get<EmployeeUser>('url/api/users/admin/' + userId, { headers, responseType: 'text' as 'json' });
  }

  getAllUserEmployees() {
    const headers = this.createHeadersWithToken()
    return this.http.get<EmployeeUser>("url/api/users/admin/all-users", { headers, responseType: 'text' as 'json' });
  }

  editUserAccount(user: User, isPassEdited: boolean, userId?: number) {
    const headers = this.createHeadersWithToken()
    return this.http.put<User>('url/api/users/admin/' + userId?.toString() + '/' + isPassEdited , user, { headers, responseType: 'text' as 'json' });
  }

  createUserAccount(newUser?: User){
    const headers = this.createHeadersWithToken()
    return this.http.post<User>('url/api/users/createAccount', newUser,{headers, responseType: 'text' as 'json'});
  }
}
