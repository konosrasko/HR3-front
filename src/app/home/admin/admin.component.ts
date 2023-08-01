import { Component, OnInit, ViewChild} from '@angular/core';
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
export class AdminComponent implements OnInit{
  // employee:Employee = new Employee;
  // ngOnInit() {
  //
  //
  //     var emplo={
  //       "id": 1,
  //       "firstName": "Stamatis",
  //       "lastName": "Chatzis",
  //       "email": "schatzis@ots.gr",
  //       "mobileNumber": 231063243,
  //       "address": "Panadreoy 164 Neapoli",
  //       "hireDate": new Date,
  //       "enabled": true,
  //       "supervisorId": 0
  //   }
  //
  //   const user1={
  //       "username" : "test",
  //       "password" : "{noop}123",
  //       "isEnabled" : true,
  //       "role" : "ADMIN",
  //       "employeeId" : 1,
  //       "isSupervisor" : false
  //     }
  //
  //
  //   this.employee=emplo;
  // }

  ngOnInit() {
  }

  Data: employeeUser[]=[
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

  ngAfterViewInit(): void {
  }

      // @ViewChild(MatPaginator) paginator: MatPaginator;
      //
      // ngAfterViewInit() {
      //   this.dataSource.paginator = this.paginator;
      // }






}
