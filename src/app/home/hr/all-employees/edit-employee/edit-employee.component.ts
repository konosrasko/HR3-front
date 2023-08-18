import {Component, Input} from '@angular/core';
import {Employee} from "../../../../models/employee.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
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

    supervisorLastName?: string;

    myForm: FormGroup;
    selectedEmployeeId?: number;
    isEditMode: boolean = false;
    dataLoaded: boolean = false;

    supervisors?: Supervisors[];
    supervisor?: Supervisors;
    enabled: boolean = false;

    constructor(private route: ActivatedRoute, private userService: UserService, private employeeService: EmployeeService, private toast: NgToastService, private date: DatePipe) {
        this.route.queryParams.subscribe(params => {
            this.selectedEmployeeId = params["employee"];
            this.supervisorLastName = params["supervisorLastName"];
        })
        this.myForm = new FormGroup({
            firstName: new FormControl({value: '', disabled: !this.isEditMode}, [Validators.required, Validators.maxLength(20)]),
            lastName: new FormControl({value: '', disabled: !this.isEditMode}, [Validators.required, Validators.maxLength(20)]),
            email: new FormControl({value: '', disabled: !this.isEditMode}, [Validators.required, Validators.maxLength(100), Validators.email]),
            address: new FormControl({value: '', disabled: !this.isEditMode}, [Validators.required, Validators.maxLength(30)]),
            mobileNumber: new FormControl({value: '', disabled: !this.isEditMode}, [Validators.required, Validators.maxLength(10)]),
            hireDate: new FormControl({value: '', disabled: !this.isEditMode}, [Validators.required, Validators.maxLength(100)]),
            supervisorId: new FormControl({value: "{{this.supervisorLastName}}", disabled: !this.isEditMode}),
            enabled: new FormControl({value: '', disabled: !this.isEditMode}, [Validators.required])
        })

    }

    ngOnInit(): void {
        if (this.selectedEmployeeId != null) {

            this.employeeService.getEmployeeById(this.selectedEmployeeId).subscribe({
                    next: data => {
                        this.loadEmployee(data);
                        this.myForm.patchValue(this.employee); // Assuming the response data keys match form control names
                        this.dataLoaded = true;
                    },
                    error: error => console.log(error)
                }
            );

            this.employeeService.getAllSupervisors().subscribe({
                next: data => {
                    this.loadSupervisor(data);
                },
                error: error => {
                    console.log(error);
                }
            })

            console.log(this.supervisorLastName);
        }
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
                    if (error.status === HttpStatusCode.GatewayTimeout) {
                        this.toast.error({
                            detail: 'Αποτυχία!',
                            summary: 'Υπήρξε πρόβλημα στην επικοινωνία με τον server!',
                            position: "topRight",
                            duration: 3000
                        });
                    }
                    console.log(error);
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

    loadEmployee(data: any) {
        this.employee = JSON.parse(data);
        this.originalEmployee = JSON.parse(data);
        this.myForm.get('supervisorId')?.setValue(this.supervisorLastName);
    }

    loadSupervisor(data: any) {
        this.supervisors = JSON.parse(data);
        for (let i = 0; i < this.supervisors!.length; i++) {
            if (this.supervisors != null) {
                if (this.employee.supervisorId === this.supervisors[i].employeeId) {
                    this.myForm.get("supervisorId")?.setValue(this.supervisors[i].employeeId);
                }
            }
        }
        const selectedSupervisor = this.supervisors?.find(supervisor => supervisor.lastName === this.supervisorLastName);
        if (selectedSupervisor) {
            this.myForm.get("supervisorId")?.setValue(selectedSupervisor.employeeId);
        }
    }

    public myError = (controlName: string, errorName: string) => {
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


    onSupervisorSelectionChange(event: any): void {
        const selectedSupervisorId = event.value;
        console.log('Selected Supervisor ID:', parseInt(selectedSupervisorId));
    }


}
