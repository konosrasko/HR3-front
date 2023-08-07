import { Component, OnInit } from '@angular/core';
import { Employee } from 'src/app/models/employee.model';
import { UserService } from 'src/app/services/user.service';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {error} from "@angular/compiler-cli/src/transformers/util";

@Component({
  selector: 'app-my-details',
  templateUrl: './my-details.component.html',
  styleUrls: ['./my-details.component.scss']
})
export class MyDetailsComponent implements OnInit {
    employee: Employee = new Employee();
    originalEmployee: Employee = new Employee();

    // @ts-ignore
  token: string = localStorage.getItem('token');


    isEditMode: boolean = false;
    isSaveMode: boolean = false;
    dataLoaded: boolean = false;

    constructor(private userService: UserService, private http: HttpClient) {
    }

    enableEditMode() {
        // Make a copy of the original employee to revert changes if canceled
        this.originalEmployee = {...this.employee};
        this.isEditMode = true;
    }

    saveDetails() {
        this.userService.saveEmployeeDetails(this.employee, this.token).subscribe(
            (data) => {
                this.isEditMode = false;
                this.isSaveMode = true;
            }
        )
    }

    cancelEdit() {
        this.employee = {...this.originalEmployee};
        this.isEditMode = false;
    }

    loadEmployee(data: any){
        this.employee = JSON.parse(data);
    }

    ngOnInit(): void {
        if (this.token != null) {
          this.userService.getEmployeeDetails(this.token).subscribe({
            next: data => this.loadEmployee(data),
            error: error => console.log(error)
            }
          );
          this.dataLoaded = true;
          this.originalEmployee = {...this.employee};
        }
    }
}
