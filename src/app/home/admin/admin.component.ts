import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {EmployeeUser} from "../../models/employeeUser.model";
import {Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {NgToastService} from "ng-angular-popup";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit{
  constructor(private router:Router, private userService: UserService, private toast: NgToastService) {}

  employeeUsers?: EmployeeUser[];

  status:string[] = ["all", "enabled", "disabled"];
  role:string[] = ["all", "admin", "hr", "employee"];
  selectedStatus: string = "all";
  selectedRole: string = "all";
  selectedUsername: string = "";
  displayedColumns: string[] = ['username', 'employees-name', 'role', 'enabled', 'supervisor', 'editBtn'];
  dataSource?: any
  showContent?: string;
  isLoaded: boolean = false;
  rowData ?: EmployeeUser;
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  ngOnInit() {
      this.userService.getAllUserEmployees().subscribe({
        next: data =>{
          this.loadData(data);
        },
        error: err => {
          this.toast.error({detail: 'Αποτυχία!', summary: err.error, position: "topRight", duration: 3000});
          this.router?.navigateByUrl('home/landing');
      }
    });
  }

  loadData(data: any){
    this.employeeUsers = JSON.parse(data);
    this.dataSource = new MatTableDataSource<EmployeeUser>(this.employeeUsers);
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = function (record: { username: string; }, filter: string) {
      return record.username.toLocaleLowerCase() == filter.toLocaleLowerCase();
    }
    this.isLoaded = true;
  }

  toggleContentEnabled(status: boolean) {
    return this.showContent = status ? "Ενεργός" : "Ανενεργός";
  }

  toggleContentSupervisor(status: boolean) {
    return this.showContent = status ? "Είναι προιστάμενος" : "Δεν είναι προιστάμενος";
  }

  getIndexClass(row: any): string {
    const index = this.dataSource.data.indexOf(row);
    return index % 2 === 0 ? 'even-row' : 'odd-row';
  }

  onChangeStatus(){
    const filterValue = this.selectedStatus;
    if(filterValue === 'all') {
      this.dataSource.filterPredicate = function(data: { enabled: any; }, filter: any): boolean {
        return String(data.enabled).includes('true') || String(data.enabled).includes('false');
      };
    }
    else if(filterValue === 'enabled'){
      this.dataSource.filterPredicate = function(data: { enabled: any; }, filter: any): boolean {
        return String(data.enabled).includes('true');
      };
    }else if(filterValue === 'disabled') {
      this.dataSource.filterPredicate = function (data: { enabled: any; }, filter: any): boolean {
        return String(data.enabled).includes('false');
      };
    }
    this.applyFilter();
  }

  onRoleChange(event:any){
    const filterValue = this.selectedRole.toLowerCase();

    if(filterValue === 'all') {
      this.dataSource.filterPredicate = (data: { role: string; }, filter: any) => {
        return data.role.toLowerCase().includes("admin") || data.role.toLowerCase().includes("hr") || data.role.toLowerCase().includes("employee");
      };
    }else {
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        return data.role.toLowerCase().includes(filter);
      };
    }
      this.applyFilter();
  }

  onUsernameChange($event: Event){
    const filterValue = ($event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.selectedUsername = filterValue.trim().toLowerCase();
    this.applyFilter();
  }

  applyFilter(){
    const statusFilterValue = this.selectedStatus;
    const roleFilterValue = this.selectedRole.toLowerCase();
    const userFilterValue = this.selectedUsername;

    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const statusMatch =
        statusFilterValue === 'all' ||
        (statusFilterValue === 'enabled' && String(data.enabled).includes('true')) ||
        (statusFilterValue === 'disabled' && String(data.enabled).includes('false'));

      const roleMatch =
        roleFilterValue === 'all' ||
        data.role.toLowerCase().includes(roleFilterValue);

      const userMatch = data.username.toLowerCase().includes(userFilterValue);

      return statusMatch && roleMatch && userMatch;
    };

    this.dataSource.filter = `${statusFilterValue}${roleFilterValue}${userFilterValue}`;
  }

  editUser(){
    setTimeout(()=>{
      if (this.rowData) {
        this.router?.navigate(['home/admin/edit-user'], { queryParams: {userId: this.rowData.userId}});
      }
    }, 200)
  }

  setRowData(data: EmployeeUser){
    this.rowData = data;
  }

  navigateTo(url:string ){
    this.router?.navigateByUrl('home/admin/' + url);
  }
}
