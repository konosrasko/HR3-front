import { Component } from '@angular/core';
import {Employee} from "../../../models/employee.model";
import {MatTableDataSource} from "@angular/material/table";
import {Subscription} from "rxjs";
import {EmployeeService} from "../../../services/employee.service";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-requests',
  templateUrl: './subordinate-list.component.html',
  styleUrls: ['./subordinate-list.component.scss']
})
export class SubordinateListComponent {
  employees: Employee[] = [];
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'mobileNumber', 'address', 'hireDate', 'enabled', 'supervisorLastName'];
  token: string | null = localStorage.getItem('token');
  dataSource = new MatTableDataSource<Employee>([]); // Initialize with empty array
  private subscription: Subscription | undefined;
  showContent?:string;

  constructor(private employeeService: EmployeeService, private http: HttpClient, private router:Router) {}

  ngOnInit(): void {
    if (this.token != null) {
      this.subscription = this.employeeService.getAllSubordinates(this.token).subscribe({
        next: (data) => {
          this.loadEmployees(data);
        },
        error: (error) => console.log(error),
      });
    }
  }


  loadEmployees(data: any) {
    this.employees = JSON.parse(data);
    this.dataSource.data = this.employees;
    console.log(this.dataSource);
  }

  getIndexClass(row: any): string {
    const index = this.dataSource.data.indexOf(row);
    return index % 2 === 0 ? 'even-row' : 'odd-row';
  }



  toggleContentEnabled(status: boolean) {
    return this.showContent = status ? "Ενεργός" : "Ανενεργός";
  }
}
