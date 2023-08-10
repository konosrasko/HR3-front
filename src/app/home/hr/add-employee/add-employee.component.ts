import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { EmployeeService } from "../../../services/employee.service";
import { Employee } from "../../../models/employee.model";
import {DatePipe} from "@angular/common";
import {Supervisors} from "../../../models/supervisors";
import {Observable} from "rxjs";
@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {
  EmployeeAddFormGroup: FormGroup;
  employee: Employee = new Employee();
  supervisors:any[]=[]
  // @ts-ignore
  token:String = localStorage.getItem('token')


  constructor(private router: Router, private employeeService: EmployeeService,private datePipe:DatePipe ) {
    this.EmployeeAddFormGroup = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      mobileNumber: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      hireDate: new FormControl('', [Validators.required]),
      enabled: new FormControl('', [Validators.required]),
      supervisorId: new FormControl('', [Validators.required])
    });

  }

  ngOnInit(): void {
    // Any additional initialization logic can go here
  }

  onSubmit() {
    this.employee = this.EmployeeAddFormGroup.value;
    const formattedHireDate = this.datePipe.transform(this.employee.hireDate, 'yyyy-MM-dd');
    this.employee.hireDate = formattedHireDate
    this.employeeService.addEmployee(this.employee, this.token);
    console.log(this.employee);
  }

  cancel() {
    this.router.navigateByUrl('../');
  }


}
