import {Component, OnInit} from '@angular/core';
import {EmployeeService} from "../services/employee.service";
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

  username:string = ''
  password:string = ''
  message:string = ''
  employee:any;
  constructor(private employeeService:EmployeeService, private router: Router) {
  }
  ngOnInit(): void {
  }

  doLogin()
  {
    
    let response = this.employeeService.Login(this.username,this.password)
    response.subscribe(data=>{
        this.employee = data;

        console.log(this.employee)}
    )
    this.router.navigate(['/home']);
  }
}
