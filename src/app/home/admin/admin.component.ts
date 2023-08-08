import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {EmployeeUser} from "../../models/employeeUser.model";
import {Router} from "@angular/router";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit{
  constructor(private router:Router, private userService: UserService) {}

  token: string | null = localStorage.getItem('token');
  employeeUsers?: EmployeeUser[];

  status:string[] = ["all", "enabled", "disabled"];
  role:string[] = ["all", "admin", "hr", "employee"];
  selectedStatus: string = "all";
  selectedRole: string = "all";
  selectedUsername: string = "";
  displayedColumns: string[] = ['username','password','role','firstName', 'lastName','enabled','supervisor', 'editBtn'];
  dataSource?: any
  showContent?: string;

  ngOnInit() {
    if(this.token != null){
      this.userService.getAllUserEmployees(this.token).subscribe({
        next: data => this.loadData(data),
        error: err => {console.log(err); alert("Υπήρξε πρόβλημα με την βάση");}
      })
    }else{
      alert("Πρέπει να συνδεθείς πρώτα!");
      this.router?.navigateByUrl('login');
    }
  }

  loadData(data: any){
    this.employeeUsers = JSON.parse(data);
    this.dataSource = new MatTableDataSource<EmployeeUser>(this.employeeUsers);
    this.dataSource.filterPredicate = function (record: { username: string; }, filter: string) {
      return record.username.toLocaleLowerCase() == filter.toLocaleLowerCase();
    }
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

  onChangeStatus(event:any){
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

  editUser(event: Event){
    const cell = event.target as HTMLElement;
    const rowData = this.getRowDataFromCell(cell);
    if (rowData) {
      this.router?.navigate(['home/admin/edit-user'], { queryParams: {user: rowData.username}});
    }
  }

  getRowDataFromCell(cell: HTMLElement) {
    const row = cell.parentElement?.parentElement?.parentElement;
    if (row && row.parentElement?.parentElement) {
      const rowIndex = Array.from(row.parentElement?.children).indexOf(row) - 1;
      return this.dataSource.data[rowIndex];
    }else return undefined;
  }

  navigateTo(url:string ){
    this.router?.navigateByUrl('home/admin/' + url);
  }
}
