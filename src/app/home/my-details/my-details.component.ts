import { Component, OnInit } from '@angular/core';
import { Employee } from 'src/app/models/employee.model';
import { UserService } from 'src/app/services/user.service';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
  selector: 'app-my-details',
  templateUrl: './my-details.component.html',
  styleUrls: ['./my-details.component.scss']
})
export class MyDetailsComponent implements OnInit {
    employee: Employee = new Employee();
    originalEmployee: Employee = new Employee();

    token: string | null = localStorage.getItem('token');


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
        this.userService.saveEmployeeDetails(this.employee).subscribe(
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

    getEmployeeDetails(token: string): Observable<Employee> {
        let tokenStr = "Bearer " + token;
        const headers = new HttpHeaders().set('Authorization', tokenStr);
        return this.http.get<Employee>('url/api/users/employee_info', {headers, responseType: "text" as 'json'});
    }

    loadEmployee(data: any){
        this.employee = data;
    }

    ngOnInit(): void {
        if (this.token != null) {

            this.getEmployeeDetails(this.token).subscribe(
                (data) => {
                    this.loadEmployee(data);
                    //this.employee = data;
                    console.log(this.employee);
                    this.originalEmployee = {...this.employee};
                    this.dataLoaded = true; // Set dataLoaded to true when the data is available
                },
                (error) => {
                    console.error(error);
                }
            );
        }
    }
}
