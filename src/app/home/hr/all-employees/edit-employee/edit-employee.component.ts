import {Component} from '@angular/core';
import {Employee} from "../../../../models/employee.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../../../services/user.service";
import {EmployeeService} from "../../../../services/employee.service";
import {NgToastService} from "ng-angular-popup";
import {DatePipe} from "@angular/common";
import {HttpStatusCode} from "@angular/common/http";
import {Supervisors} from "../../../../models/supervisors";

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.scss']
})

export class EditEmployeeComponent {
  employee!: Employee;
  originalEmployee!: Employee;

  editEmployeeFormGroup: FormGroup;
  selectedEmployeeId?: number;
  isEditMode: boolean = false;
  dataLoaded: boolean = false;

  supervisors?: Supervisors[];
  supervisor?: Supervisors;
  enabled?: boolean;

  constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private employeeService: EmployeeService, private toast: NgToastService, private date: DatePipe) {
    this.route.queryParams.subscribe(params => {
      this.selectedEmployeeId = params["employee"];
    })
    this.editEmployeeFormGroup = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      lastName: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      email: new FormControl('', [Validators.required, Validators.maxLength(100), Validators.email]),
      address: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      mobileNumber: new FormControl('', [Validators.required, Validators.maxLength(10)]),
      hireDate: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      enabled: new FormControl('', [Validators.required]),
      supervisorId: new FormControl('none', [Validators.required])
    })
  }

  ngOnInit(): void {
    if (this.selectedEmployeeId != null) {
      this.employeeService.getAllSupervisors().subscribe({
        next: data => {
          this.loadSupervisor(data);
        },
        error: error => {
          console.log(error);
          this.toast.error({detail: "Πρόβλημα φόρτωσης δεδομένων", summary: error.error, position: "topRight", duration: 4000})
        }
      })

      this.employeeService.getEmployeeById(this.selectedEmployeeId).subscribe({
        next: data => {
          this.loadEmployee(data);
          this.dataLoaded = true;
        },
        error: error => {
          this.toast.error({detail: "Πρόβλημα φόρτωσης δεδομένων", summary: error.error, position: "topRight", duration: 4000});
          console.log(error);
        }
      });
    }
  }

  loadEmployee(data: any) {
    this.employee = JSON.parse(data);
    this.originalEmployee = JSON.parse(data);

    this.editEmployeeFormGroup.patchValue(this.employee);
    this.editEmployeeFormGroup.get('enabled')?.setValue(this.employee.enabled);

    this.enabled = this.employee.enabled;
  }

  loadSupervisor(data: any) {
    this.supervisors = JSON.parse(data);
  }

  onEdit(){
    this.isEditMode = true;
  }

  saveDetails() {
    if (this.editEmployeeFormGroup.valid) {
      this.employee = this.editEmployeeFormGroup.value;
      this.employee.employeeId = this.originalEmployee.employeeId;
      this.employee.hireDate = this.date.transform(this.employee.hireDate, 'yyyy-MM-dd');
      this.userService.saveEmployeeDetails(this.employee).subscribe({
        next: () => {
          this.isEditMode = false;
          this.editEmployeeFormGroup.disable();
          this.toast.success({detail: 'Επιτυχής Αποθήκευση!', summary: 'Η επεξεργασία των στοιχείων σας έγινε με επιτυχία!', position: "topRight", duration: 5000});
        },
        error: error => {
          if (error.status === HttpStatusCode.GatewayTimeout) {
            this.toast.error({detail: 'Προβλημα επικοινωνίας!', summary: 'Υπήρξε πρόβλημα στην επικοινωνία με τον server!', position: "topRight", duration: 3000});
          }else{
            this.toast.error({detail: 'Πρόβλημα αποθήκευσης δεδομένων!', summary: error.error, position: "topRight", duration: 3000});
          }
        }
      });
    }
  }

  cancelEdit() {
    this.router?.navigateByUrl('home/hr/all-employees');
  }

  public myError = (controlName: string, errorName: string) => {
    return this.editEmployeeFormGroup.controls[controlName].hasError(errorName);
  }
}
