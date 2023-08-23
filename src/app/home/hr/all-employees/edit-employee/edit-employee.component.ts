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
import {LeaveCategory} from "../../../../models/leave-category.model";
import {LeaveBalance} from "../../../../models/leave_balance.model";
import {LeaveCategoryService} from "../../../../services/leave-category.service";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.scss']
})

export class EditEmployeeComponent {
  employee!: Employee;
  originalEmployee!: Employee;
  leaveCategories?: LeaveCategory[];
  leaveBalances?: LeaveBalance[];
  leaveDataSource = new MatTableDataSource<any>([]);
  editEmployeeFormGroup: FormGroup;
  selectLeaveCategoryFormGroup?: FormGroup;
  leaveDataTable: any = [];
  selectedEmployeeId?: number;
  isEditMode: boolean = false;
  dataLoaded: boolean = false;
  editLeaves: boolean = false;
  supervisors?: Supervisors[];
  supervisor?: Supervisors;
  enabled?: boolean;
  displayedColumns: string[] = ['title', 'days', 'options'];
  selectedLeaveCategory = 0;

  constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private employeeService: EmployeeService, private toast: NgToastService, private date: DatePipe, private leaveCategoryService: LeaveCategoryService) {
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
      });

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

      this.leaveCategoryService.getActiveLeaveCategories().subscribe({
        next: data => this.loadCategories(data),
        error: err => {
          console.log(err);
          this.toast.error({detail: 'Παρουσιάστηκε σφάλμα!', summary: err.error, position: "topRight", duration: 4000});
          this.router?.navigateByUrl('home/landing');
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

  loadCategories(data: any){
    this.leaveCategories = JSON.parse(data);
  }

  onEdit(){
    this.isEditMode = true;
  }

  onClickForAddLeave(){
    this.editLeaves = true;
    this.selectLeaveCategoryFormGroup = new FormGroup({
      title: new FormControl('', [Validators.required]),
      days: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9]*$")])
    });
  }

  onDeleteRow(row: number){
    this.leaveDataTable.splice(row, 1);
    this.updateLeaveData();
    this.toast.info({detail: 'Διαγραφή άδειας', summary: 'Η άδεια διαγράφτηκε με επιτυχία', position: "topRight", duration: 2000})
  }

  onLeaveDaysError(){
    if(this.selectLeaveCategoryFormGroup != null){
      if(this.selectLeaveCategoryFormGroup.get('days')?.hasError('maxlength')){
        return 'Ο αριθμός είναι υπερβολικά μεγάλος';
      }else if(this.selectLeaveCategoryFormGroup.get('days')?.hasError('required')){
        return 'Το πεδίο είναι υποχρεωτικό';
      }else if(this.selectLeaveCategoryFormGroup.get('days')?.hasError('pattern')){
        return 'Πρέπει να εισάγεις μόνο αριθμούς';
      }else {
        return '';
      }
    }else {
      return '';
    }
  }

  getIndexClass(row: number){
    const index = this.leaveDataSource.data.indexOf(row);
    return index % 2 === 0 ? 'even-row' : 'odd-row';
  }

  onAddLeave(){
    if(this.selectLeaveCategoryFormGroup != null){
      let valueSplit = this.selectLeaveCategoryFormGroup.get('title')?.value.split(',');
      let leaveTitle: string = valueSplit[1];
      let days: number = this.selectLeaveCategoryFormGroup.get('days')?.value;

      const newLeaveData = {leaveTitle, days};

      this.leaveDataTable.push(newLeaveData);
      this.updateLeaveData();

      this.editLeaves = false
      this.toast.info({detail: 'Προσθήκη άδειας', summary: 'Η άδεια προστέθηκε με επιτυχία', position: "topRight", duration: 2000})
    }
  }

  saveDetails() {
    if (this.editEmployeeFormGroup.valid) {
      this.employee = this.editEmployeeFormGroup.value;
      this.employee.employeeId = this.originalEmployee.employeeId;
      this.employee.hireDate = this.date.transform(this.employee.hireDate, 'yyyy-MM-dd');
      this.userService.saveEmployeeDetails(this.employee).subscribe({
        next: () => {
          this.isEditMode = false;
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

  updateLeaveData(){
    this.leaveDataSource.data = this.leaveDataTable;
  }

  public myError = (controlName: string, errorName: string) => {
    return this.editEmployeeFormGroup.controls[controlName].hasError(errorName);
  }
}
