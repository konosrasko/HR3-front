import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {employeeUser} from "../../models/employeeUser.model";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit{
  Data: employeeUser[]=[
    {"username" : "test",
      "password" : "123",
      "enabled" : true,
      "role" : "ADMIN",
      "firstName": "Stamatis",
      "lastName": "Chatzis"
    },
    {"username" : "test",
      "password" : "123",
      "enabled" : true,
      "role" : "HR",
      "firstName": "Stamatis",
      "lastName": "Chatzis"
    },
    {"username" : "test",
      "password" : "123",
      "enabled" : false,
      "role" : "Employee",
      "firstName": "Stamatis",
      "lastName": "Chatzis"
    }
  ]

  status:string[] = ["all", "enabled", "disabled"];
  role:string[] = ["all", "admin", "hr", "employee"];
  selectedStatus: string = "all";
  selectedRole: string = "all";
  selectedUsername: string = "";

  displayedColumns: string[] = ['username','password','role','firstName', 'lastName','enabled'];
  dataSource = new MatTableDataSource<employeeUser>(this.Data);

  showContent?: string;

  filters = this.dataSource.filter = '';

  ngOnInit() {
    this.dataSource.filterPredicate = function (record,filter) {
      return record.username.toLocaleLowerCase() == filter.toLocaleLowerCase();
    }
  }

  toggleContent(status: boolean) {
    return this.showContent = status ? "Ενεργός" : "Ανενεργός";
  }

  getIndexClass(row: any): string {
    const index = this.dataSource.data.indexOf(row);
    return index % 2 === 0 ? 'even-row' : 'odd-row';
  }

  onChangeStatus(event:any){
    const filterValue = this.selectedStatus;
    if(filterValue === 'all') {
      this.dataSource.filterPredicate = function(data, filter): boolean {
        return String(data.enabled).includes('true') || String(data.enabled).includes('false');
      };
    }
    else if(filterValue === 'enabled'){
      this.dataSource.filterPredicate = function(data, filter): boolean {
        return String(data.enabled).includes('true');
      };
    }else if(filterValue === 'disabled') {
      this.dataSource.filterPredicate = function (data, filter): boolean {
        return String(data.enabled).includes('false');
      };
    }
    this.applyFilter();
  }

  onRoleChange(event:any){
    const filterValue = this.selectedRole.toLowerCase();

    if(filterValue === 'all') {
      this.dataSource.filterPredicate = (data, filter) => {
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
}
