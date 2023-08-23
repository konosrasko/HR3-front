import {Component, ViewChild} from '@angular/core';
import {Employee} from "../../../models/employee.model";
import {MatTableDataSource} from "@angular/material/table";
import {EmployeeService} from "../../../services/employee.service";
import {HttpStatusCode} from "@angular/common/http";
import {Router} from "@angular/router";
import {NgToastService} from "ng-angular-popup";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-requests',
  templateUrl: './subordinate-list.component.html',
  styleUrls: ['./subordinate-list.component.scss']
})
export class SubordinateListComponent {
  employees?: Employee[];
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'mobileNumber', 'address', 'hireDate', 'enabled', 'supervisorLastName','editfield'];
  token: string | null = localStorage.getItem('token');
  dataSource?: any
  showContent?: string;
  isLoaded: boolean = false;
  showIndirect: boolean = false;
  selectedFirstName: string = "";
  cell?:any;
  selectedEmployeeId?: number;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private employeeService: EmployeeService, private toast: NgToastService, private router: Router) {
    this.reloadList()
  }

  reloadList(){
    if(this.showIndirect){
      this.employeeService.getAllSubordinates().subscribe({
        next: data => {
          this.loadEmployees(data)
        },
        error: error => {
          if (error.status === HttpStatusCode.GatewayTimeout) {
            this.toast.error({
            detail: 'Αποτυχία!',
            summary: "There was a gateway error",
            position: "topRight",
            duration: 4000
            });
          }
        }
      })
    }
    else {
      this.employeeService.getDirectSubordinates().subscribe({
        next: data => {
          this.loadEmployees(data);
        },
        error: error => {
          if(error.status === HttpStatusCode.GatewayTimeout){
            this.toast.error({detail: 'Αποτυχία!', summary: "Αποτυχία επικοινωνίας με τον σέρβερ!", position: "topRight", duration: 4000});
          }
          this.toast.error({detail: 'Αποτυχία!', summary: "Σφάλμα", position: "topRight", duration: 4000});
        }
      })
    }
  }

  loadEmployees(data: any) {
    this.employees = JSON.parse(data);
    this.dataSource = new MatTableDataSource<Employee>(this.employees);
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = function (record: { firstName: string }) {
      return record.firstName.toLocaleLowerCase();
    }
    this.isLoaded = true;
  }

  getIndexClass(row: any): string {
    const index = this.dataSource.data.indexOf(row);
    return index % 2 === 0 ? 'even-row' : 'odd-row';
  }

  toggleDirectSubordinates() {
    this.showIndirect = !this.showIndirect;
    this.reloadList()
  }

  toggleContentEnabled(status: boolean) {
    return this.showContent = status ? "Ενεργός" : "Ανενεργός";
  }

  onFirstNameChange($event: Event) {
    const filterValue = ($event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.selectedFirstName = filterValue.trim().toLowerCase();
    this.applyFilter();
  }

  applyFilter() {
    const userFilterValue = this.selectedFirstName;
    this.dataSource.filterPredicate = (data: any) => {
      const userMatch = data.firstName.toLowerCase().includes(userFilterValue);
      return userMatch;
    };
    this.dataSource.filter = `${userFilterValue}`;
  }
  getRow(employee : Employee){
    this.selectedEmployeeId = employee.employeeId;
  }

  editSubordinateProfile(event: Event){
    const cell = event.target as HTMLElement;
    const parentCell = cell.parentElement;
    if(parentCell !== null) {
      this.selectedEmployeeId = this.getRowDataFromCell(parentCell).employeeId;
      if (this.selectedEmployeeId) {
        this.router?.navigate(['home/subordinates/subordinate-profile'], {queryParams: {employee: this.selectedEmployeeId}});
      }
    }
  }

  navigateTo(url:string ){
    this.router?.navigateByUrl('home/subordinates/' + url);
  }

  getRowDataFromCell(cell: HTMLElement) {
    const row = cell.parentElement;
    if (row && row.parentElement?.parentElement) {
      const rowIndex = Array.from(row.parentElement?.children).indexOf(row) - 1;
      return this.dataSource.data[rowIndex];
    }else return undefined;
  }


  showLeaveBalances(event: Event) {
    const cell = event.target as HTMLElement;

    const rowData = this.getRowDataFromCell(cell);
    if (rowData) {
      this.router.navigate(['home/leaves/restLeaves'], {
        queryParams: {
         id: rowData.employeeId,
         firstName:rowData.firstName,
         lastName:rowData.lastName
        }
      });
    }
  }

  protected readonly onclick = onclick;
}

