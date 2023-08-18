import {Component} from '@angular/core';
import {UserService} from "../services/user.service";
import {Employee} from '../models/employee.model';


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

  ngOnInit(): void {}

}
