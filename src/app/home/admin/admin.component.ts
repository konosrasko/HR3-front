import { Component, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {Employee} from "../../models/employee.model";
import {User} from "../../models/user.model";
import {employeeUser} from "../../models/employeeUser.model";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent{

  showContent?: string;

  toggleContent(status: boolean) {
    return this.showContent = status ? "Ενεργός" : "Ανενεργός";
  }

  getIndexClass(row: any): string {
    const index = this.dataSource.data.indexOf(row);
    return index % 2 === 0 ? 'even-row' : 'odd-row';
  }

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
      "role" : "ADMIN",
      "firstName": "Stamatis",
      "lastName": "Chatzis"
    },
    {"username" : "test",
      "password" : "123",
      "enabled" : true,
      "role" : "ADMIN",
      "firstName": "Stamatis",
      "lastName": "Chatzis"
    }
  ]

  displayedColumns: string[] = ['username','password','role','firstName', 'lastName','enabled'];
  dataSource = new MatTableDataSource<employeeUser>(this.Data);

}
