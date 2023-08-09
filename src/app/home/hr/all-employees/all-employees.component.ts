import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { Employee } from '../../../models/employee.model';
import { EmployeeService } from '../../../services/employee.service';
import { Subscription } from 'rxjs';
import {Router} from "@angular/router";

@Component({
  selector: 'app-all-employees',
  templateUrl: './all-employees.component.html',
  styleUrls: ['./all-employees.component.scss'],
})
export class AllEmployeesComponent implements OnInit, OnDestroy {
  employees: Employee[] = [];
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'mobileNumber', 'address', 'hireDate', 'enabled', 'supervisorId'];
  token: string | null = localStorage.getItem('token');
  dataSource = new MatTableDataSource<Employee>([]); // Initialize with empty array
  private subscription: Subscription | undefined;

  constructor(private employeeService: EmployeeService, private http: HttpClient, private router:Router) {}

  ngOnInit(): void {
    if (this.token != null) {
      this.subscription = this.employeeService.getAllEmployees(this.token).subscribe({
        next: (data) => {
          this.loadEmployees(data);
        },
        error: (error) => console.log(error),
      });
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
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
  navigateTo(componentToOpen: String){
    this.router.navigateByUrl('home/hr/' + componentToOpen);
  }
  editRequest(event: Event){
    const cell = event.target as HTMLElement;
    console.log(cell)

    const rowData = this.getRowDataFromCell(cell);
    console.log(rowData)
    if (rowData) {
      //Open edit window with the selected leaveRequest as parameter
      this.router.navigate(['home/leaves/add'],{ queryParams: {id: rowData.employeeId}});
    }
  }

  private getRowDataFromCell(cell: HTMLElement) {
    const row = cell.parentElement;
    if (row && row.parentElement) {
      const rowIndex = Array.from(row.parentElement.children).indexOf(row);
      return this.dataSource.data[rowIndex - 1];
    }
    return undefined;
  }
}
