import { Component } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { Employee } from "../../../models/employee.model";
import { Router } from "@angular/router";
import {group} from "@angular/animations";

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})

export class AddUserComponent {

  constructor(private route: Router) {
  }

  username = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  employees = new FormControl('', [Validators.required]);
  roles = new FormControl('', [Validators.required]);


  Employees: Employee[] = [
    {
      "employeeId" : 1,
      "firstName" : "Simos",
      "lastName" : "Spyroy",
      "email" : "sspiroy@ots.gr",
      "mobileNumber": "1234567891",
      "address" : "Kyparissias 8"
    },
    {
      "employeeId" : 2,
      "firstName" : "Mixail",
      "lastName" : "Fotiadis",
      "email" : "mfotiadis@ots.gr",
      "mobileNumber": "1234567891",
      "address" : "Sikelianoy 51"
    }
  ]

  selectedEmployee = "";
  selectedRole = "";
  hide = true;

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

  navigateTo(){
    this.route.navigateByUrl('home/admin');
  }
}
