import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { EmployeeService } from "../../../services/employee.service";
import { Employee } from "../../../models/employee.model";
import { DatePipe } from "@angular/common";
import { NgToastService } from "ng-angular-popup";

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
  selectedOption?: Employee

  constructor(private router: Router, private employeeService: EmployeeService,private datePipe:DatePipe,private toast: NgToastService  ) {
    this.EmployeeAddFormGroup = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      mobileNumber: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      hireDate: new FormControl('', [Validators.required]),
      enabled:new FormControl('false'),
      supervisorId: new FormControl('')
    });

  }

  ngOnInit(): void {
    this.employeeService.getAllSupervisors(this.token).subscribe(supervisors => {
      this.supervisors = supervisors;

      });
  }

  onSubmit() {
    if(this.EmployeeAddFormGroup.valid) {
      console.log(this.EmployeeAddFormGroup.valid)
      this.employee = this.EmployeeAddFormGroup.value;
      this.employee.hireDate = this.datePipe.transform(this.employee.hireDate, 'yyyy-MM-dd');
      this.employee.supervisorId = this.selectedOption?.employeeId;
      this.employeeService.addEmployee(this.employee, this.token);
      this.router.navigateByUrl('/home/hr/all-employees');
      console.log(this.employee);
    }else this.toast.error({detail:"Μήνυμα λάθους",summary:"Ελέξτε τα πεδία !",position:"topRight",duration:5000})
  }

  cancel() {
    this.router.navigateByUrl('/home/hr/all-employees');

  }


}
