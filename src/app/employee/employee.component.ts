import {Component, OnInit} from '@angular/core';
import {UserService} from "../services/user.service";
import { Employee } from '../models/employee.model';


@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent   {
  employee: Employee;


  constructor(private employeeService: UserService) {
    this.employee = new Employee();

  }

  ngOnInit(): void {
    this.employee = new Employee(); // Initialize with default values
    this.employeeService.getEmployeeDetails().subscribe(
      (data) => {
        this.employee = data; // Assign data fetched from the service
      },
      (error) => {
        console.log('Error fetching employee details:', error);
      }
    );
  }

}
