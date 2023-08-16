import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { UserService } from "../../services/user.service";
import { MatTableDataSource } from "@angular/material/table";
import { SubordinatesReq } from "../../models/subordinatesReq.model";
import { EmployeeService } from "../../services/employee.service";
import { NgToastService } from 'ng-angular-popup';
import {HttpStatusCode} from "@angular/common/http";

@Component({
  selector: 'app-subordinates',
  template: `<router-outlet></router-outlet>`
})
export class SubordinatesComponent {

}
