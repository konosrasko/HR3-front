import { Component } from '@angular/core';
import {Employee} from "../../../models/employee.model";
import {MatTableDataSource} from "@angular/material/table";
import {Subscription} from "rxjs";
import {EmployeeService} from "../../../services/employee.service";
import {HttpClient, HttpStatusCode} from "@angular/common/http";
import {Router} from "@angular/router";
import {NgToastService} from "ng-angular-popup";
import {EmployeeUser} from "../../../models/employeeUser.model";

@Component({
  selector: 'app-requests',
  templateUrl: './subordinate-list.component.html',
  styleUrls: ['./subordinate-list.component.scss']
})
export class SubordinateListComponent {
  employees?: Employee[];
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'mobileNumber', 'address', 'hireDate', 'enabled', 'supervisorLastName'];
  token: string | null = localStorage.getItem('token');
  dataSource?: any
   // Initialize with empty array
  private subscription: Subscription | undefined;
  showContent?:string;
  isLoaded: boolean = false;
  showIndirect: boolean = false;
  selectedFirstName: string =  "";
  rowData?: any;
  cell?:any;
  private selectedEmployeeId?: number | undefined;

  constructor(private employeeService: EmployeeService, private http: HttpClient,private toast:NgToastService, private router:Router) {
    this.reloadList()
  }

  reloadList(){
    if(this.showIndirect){

      this.employeeService.getAllSubordinates().subscribe({
        next: data => {
          this.loadEmployees(data)
        },
        error: error => {
          if(error.status === HttpStatusCode.GatewayTimeout){
            this.toast.error({detail: 'Αποτυχία!', summary: "There was a gateway error", position: "topRight", duration: 4000});
          }
        }
      })
    }
    else {
      this.employeeService.getDirectSubordinates().subscribe({
        next: data => {
          this.loadEmployees(data)
        },
        error: error => {
          if(error.status === HttpStatusCode.GatewayTimeout){
            this.toast.error({detail: 'Αποτυχία!', summary: "There was a gateway error", position: "topRight", duration: 4000});
          }
        }
      })
    }
  }

  loadEmployees(data: any) {
    this.employees = JSON.parse(data);
    this.dataSource = new MatTableDataSource<Employee>(this.employees);
    this.dataSource.filterPredicate = function (record: {firstName: string}) {
      return record.firstName.toLocaleLowerCase();
    }
    this.isLoaded = true;
  }

  getIndexClass(row: any): string {
    const index = this.dataSource.data.indexOf(row);
    return index % 2 === 0 ? 'even-row' : 'odd-row';
  }

  toggleDirectSubordinates(){
    this.showIndirect = !this.showIndirect;
    this.reloadList()
  }

  toggleContentEnabled(status: boolean) {
    return this.showContent = status ? "Ενεργός" : "Ανενεργός";
  }

  onFirstNameChange($event: Event){
    const filterValue = ($event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.selectedFirstName = filterValue.trim().toLowerCase();
    this.applyFilter();
  }

  applyFilter(){
    const userFilterValue = this.selectedFirstName;
    this.dataSource.filterPredicate = (data: any) => {
      const userMatch = data.firstName.toLowerCase().includes(userFilterValue);
      return  userMatch;
    };
    this.dataSource.filter = `${userFilterValue}`;

  }
  getRow(employee : Employee){
    this.selectedEmployeeId = employee.employeeId;
    console.log(this.selectedEmployeeId);
  }

  editSubordinateProfile(event: Event){
    if (this.selectedEmployeeId) {
      this.router?.navigate(['home/subordinates/subordinate-profile'], { queryParams: {employee: this.selectedEmployeeId}});
    }
  }

  navigateTo(url:string ){
    this.router?.navigateByUrl('home/subordinates/' + url);
  }
}
