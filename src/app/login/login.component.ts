import {Component, OnInit} from '@angular/core';
import {EmployeeService} from "../services/employee.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

  username:string = ''
  password:string = ''
  message:string = ''
  role:any;
  constructor(private employeeService:EmployeeService, private router: Router) {
  }
  ngOnInit(): void {
  }

  doLogin()
  {
    
    let response = this.employeeService.Login(this.username,this.password)
    response.subscribe( data=>{
        this.role = data;

        console.log(this.role)}
    )
    this.router.navigate(['/home']);
  }
}
