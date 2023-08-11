import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Employee } from 'src/app/models/employee.model';
import { UserService } from 'src/app/services/user.service';
import { NgToastService } from "ng-angular-popup";
import { DatePipe } from "@angular/common";
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-my-details',
  templateUrl: './my-details.component.html',
  styleUrls: ['./my-details.component.scss']
})
export class MyDetailsComponent implements OnInit {
    employee: Employee = new Employee();
    originalEmployee!: Employee;
    // @ts-ignore
    token: string = localStorage.getItem('token');


    isEditMode: boolean = false;
    isSaveMode: boolean = false;
    dataLoaded: boolean = false;

    @ViewChild('editToggle')
    editToggle!: ElementRef;

    constructor(private userService: UserService, private cdr: ChangeDetectorRef, private tost:NgToastService, private date: DatePipe) {}

    saveDetails() {
      this.userService.saveEmployeeDetails(this.employee, this.token).subscribe({
        next: data => {
          this.isEditMode = false;
          this.isSaveMode = true;
          this.tost.success({detail: 'Επιτυχής Αποθήκευση!', summary: 'Η επεξεργασία των στοιχείων σας έγινε με επιτυχία!', position: "topRight", duration: 5000});
        },
        error: error => {
          this.tost.error({
            detail: 'Αποτυχία!',
            summary: 'Υπήρξε πρόβλημα στην επικοινωνία με τον server!',
            position: "topRight",
            duration: 3000
          });
        }
      });

    }

    cancelEdit() {
      if (this.isEditMode) {
        this.isEditMode = false;
        this.cdr.detectChanges();
        this.employee = {...this.originalEmployee}; // Revert changes here
      }
    }

    loadEmployee(data: any){
        this.employee = JSON.parse(data);
    }

    ngOnInit(): void {
        if (this.token != null) {
          this.userService.getEmployeeDetails(this.token).subscribe({
            next: data => {
              this.loadEmployee(data);
            },
            error: error => console.log(error)
            }
          );
          this.dataLoaded = true;
        }
    }
}
