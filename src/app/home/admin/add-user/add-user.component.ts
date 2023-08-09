import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { Employee } from "../../../models/employee.model";
import { Router } from "@angular/router";
import {group} from "@angular/animations";
import {UserService} from "../../../services/user.service";
import {EmployeeService} from "../../../services/employee.service";
import {User} from "../../../models/user.model";

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})

export class AddUserComponent implements OnInit{
  allEmployees?: Employee[];
  newUser?: User;
  token: string | null = localStorage.getItem('token');
  username = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  employees = new FormControl('', [Validators.required]);
  roles = new FormControl('', [Validators.required]);

  selectedEmployee = "";
  selectedRole = "";
  hide = true;

  constructor(private route: Router,private userService: UserService, private employeeService: EmployeeService) {}

  ngOnInit() {
    if(this.token != null){
      this.employeeService.getEmployeesWithoutUser(this.token).subscribe({
        next: data => this.loadEmployeeData(data),
        error: err => console.log(err)
      });
    }
  }

  loadEmployeeData(data: any){
    this.allEmployees = JSON.parse(data);
    console.log(this.allEmployees);
  }

  onSelectEmployee() {
  }

  onSelectRole(){
  }

  getErrorUsername() {
    if (this.username.hasError('required')) {
      return 'Πρέπει να εισάγεις username';
    }else {
      return "ok :)"
    }
  }

  getErrorPass(){
    if(this.password.hasError('required')){
      return 'Πρέπει να εισάγεις password';
    }else {
      return "ok :)"
    }
  }

  saveNewUser(){
    if(this.token != null){
      this.userService.createUserAccount(this!.newUser, this.token).subscribe({
        next: data => {alert("Ο νέος λογαριασμός έχει δημιουργηθεί!")},
        error: err => console.log(err)
      });
    }
  }

  navigateTo(){
    this.route?.navigateByUrl('home/admin');
  }
}
