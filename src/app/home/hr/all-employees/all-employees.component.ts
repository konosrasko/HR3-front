import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatTableDataSource} from '@angular/material/table';
import {Employee} from '../../../models/employee.model';
import {EmployeeService} from '../../../services/employee.service';
import {Subscription} from 'rxjs';
import {Router} from "@angular/router";
import {LeaveRequest} from "../../../models/leave_request.model";

@Component({
  selector: 'app-all-employees',
  templateUrl: './all-employees.component.html',
  styleUrls: ['./all-employees.component.scss'],
})
export class AllEmployeesComponent implements OnInit, OnDestroy {
  employees: Employee[] = [];
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'mobileNumber', 'address', 'hireDate', 'enabled', 'supervisorLastName','edit-field'];
  dataSource = new MatTableDataSource<Employee>([]); // Initialize with empty array
  private subscription: Subscription | undefined;
  showContent?:string;
  private selectedEmployee?: Employee;

  supervisorLastName:string = "";

  constructor(private employeeService: EmployeeService, private router:Router) {}

  ngOnInit(): void {
      this.subscription = this.employeeService.getAllEmployees().subscribe({
        next: (data) => {
          this.loadEmployees(data);
        },
        error: (error) => console.log(error),
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadEmployees(data: any) {
    this.employees = JSON.parse(data);
    this.dataSource.data = this.employees;
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
    const rowData = this.getRowDataFromCell(cell);
    if (rowData) {
      //Open edit window with the selected leaveRequest as parameter
      this.router.navigate(['home/leaves/add'],{ queryParams: {id: rowData.employeeId, firstName: rowData.firstName, lastName: rowData.lastName}});
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
  toggleContentEnabled(status: boolean) {
    return this.showContent = status ? "Ενεργός" : "Ανενεργός";
  }

  editEmployee() {

      if (this.selectedEmployee?.employeeId) {
        console.log(this.selectedEmployee.employeeId)
        //Open edit window with the selected leaveRequest id as parameter
        this.router?.navigate(['home/hr/edit-employee'], { queryParams: { employee: this.selectedEmployee.employeeId,supervisorLastName: this.selectedEmployee.supervisorLastName } });
      }
  }

  setRow(row: Employee) {
    this.selectedEmployee = row;
  }
}

