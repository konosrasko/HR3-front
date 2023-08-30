import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Employee} from 'src/app/models/employee.model';
import {UserService} from 'src/app/services/user.service';
import {NgToastService} from "ng-angular-popup";
import {DatePipe} from "@angular/common";
import {HttpStatusCode} from "@angular/common/http";
import {FormControl, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-my-details',
  templateUrl: './my-details.component.html',
  styleUrls: ['./my-details.component.scss']
})
export class MyDetailsComponent implements OnInit {
    employee!: Employee;
    originalEmployee!: Employee;
    myForm: FormGroup;
    isEditMode: boolean = false;
    dataLoaded: boolean = false;

    constructor(private userService: UserService, private cdr: ChangeDetectorRef, private toast:NgToastService, private date: DatePipe) {
      this.myForm = new FormGroup({
        firstName: new FormControl({value: '', disabled: !this.isEditMode}, [Validators.required, Validators.maxLength(20)]),
        lastName: new FormControl({value: '', disabled: !this.isEditMode}, [Validators.required, Validators.maxLength(20)]),
        email: new FormControl({value: '', disabled: !this.isEditMode}, [Validators.required, Validators.maxLength(100), Validators.email]),
        address: new FormControl({value: '', disabled: !this.isEditMode}, [Validators.required, Validators.maxLength(30)]),
        mobileNumber: new FormControl({value: '', disabled: !this.isEditMode}, [Validators.required, Validators.maxLength(10)]),
        hireDate: new FormControl({value: '', disabled: !this.isEditMode}, [Validators.required, Validators.maxLength(100)]),
      })

    }

  saveDetails() {
    if (this.myForm.valid) {
      this.employee = this.myForm.value;
      this.employee.employeeId = this.originalEmployee.employeeId;
      this.employee.hireDate = this.date.transform(this.employee.hireDate, 'yyyy-MM-dd');
      this.userService.saveEmployeeDetails(this.employee).subscribe({
        next: () => {
          this.isEditMode = false;
          this.myForm.disable();
          this.toast.success({detail: 'Επιτυχής Αποθήκευση!', summary: 'Η επεξεργασία των στοιχείων σας έγινε με επιτυχία!', position: "topRight", duration: 5000});
        },
        error: error => {
          if(error.status === HttpStatusCode.GatewayTimeout){
            this.toast.error({
              detail: 'Αποτυχία!',
              summary: 'Υπήρξε πρόβλημα στην επικοινωνία με τον server!',
              position: "topRight",
              duration: 3000
            });
          }else if (error.status === HttpStatusCode.Forbidden){
            this.toast.error({
              detail: 'Αποτυχία!',
              summary: 'Απαγορεύτηκε η πρόσβαση',
              position: "topRight",
              duration: 3000
            });
          }
        }
      });
    }
  }

    cancelEdit() {
        if (this.isEditMode) {
            this.isEditMode = false;
            this.myForm.reset(this.originalEmployee);
            this.myForm.disable();
        }
    }

    loadEmployee(data: any){
        this.employee = JSON.parse(data);
        this.originalEmployee = JSON.parse(data);
    }

    public myError = (controlName: string, errorName: string) =>{
      return this.myForm.controls[controlName].hasError(errorName);
    }

    toggleEditMode() {
        this.isEditMode = !this.isEditMode;

        if (this.isEditMode) {
            this.myForm.enable(); // Enable all form controls
        } else {
            this.myForm.disable(); // Disable all form controls
            this.myForm.reset(this.originalEmployee); // Reset form to original values
        }
    }

    ngOnInit(): void {
          this.userService.getEmployeeDetails().subscribe({
            next: data => {
              this.loadEmployee(data);
              this.myForm.patchValue(this.employee); // Assuming the response data keys match form control names
              this.dataLoaded = true;
            },
            error: error => {}
            }
          );
    }
}
