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
  isLeaveBalanceEdited = false;
  selectedRowOfLeaveTable?: number;

  constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private employeeService: EmployeeService, private toast: NgToastService, private date: DatePipe, private leaveCategoryService: LeaveCategoryService) {
    this.route.queryParams.subscribe(params => {
      this.selectedEmployeeId = params["employee"];
    })
    this.editEmployeeFormGroup = new FormGroup({
      firstName: new FormControl('', [Validators.required,  Validators.maxLength(45), Validators.pattern(/^[A-Za-zΑ-Ωα-ωΆ-Ώά-ώ\s]*$/)]),
      lastName: new FormControl('', [Validators.required,  Validators.maxLength(45), Validators.pattern(/^[A-Za-zΑ-Ωα-ωΆ-Ώά-ώ\s]*$/)]),
      email: new FormControl('', [Validators.required, Validators.maxLength(100), Validators.email]),
      address: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      mobileNumber: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern("^[0-9]*$")]),
      hireDate: new FormControl('', [Validators.required, Validators.maxLength(45), Validators.pattern(/^[A-Za-zΑ-Ωα-ωΆ-Ώά-ώ0-9\s,]*$/)]),
      enabled: new FormControl('', [Validators.required]),
      supervisorId: new FormControl('', [Validators.required])
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
          this.toast.error({detail: "Πρόβλημα φόρτωσης Προισταμένων", summary: error.error, position: "topRight", duration: 4000})
        }
      });

      this.employeeService.getEmployeeById(this.selectedEmployeeId).subscribe({
        next: data => {
          this.loadEmployee(data);
          this.dataLoaded = true;
        },
        error: error => {
          this.toast.error({detail: "Πρόβλημα φόρτωσης στοιχείων εργαζομένου", summary: error.error, position: "topRight", duration: 4000});
          console.log(error);
        }
      });

      this.employeeService.getLeaveBalancesOfAnotherEmployee(this.selectedEmployeeId).subscribe({
        next: data =>{
          this.leaveBalances = data;
          this.loadLeavesToTable();
        },
        error: err => {
          console.log(err);
          this.toast.error({detail: 'Πρόβλημα φόρτωσης αδειών εργαζομένων', summary: err.error, position: "topRight", duration: 4000});
        }
      });

      this.leaveCategoryService.getActiveLeaveCategories().subscribe({
        next: data => this.loadCategories(data),
        error: err => {
          console.log(err);
          this.toast.error({detail: 'Πρόβλημα φόρτωσης ενεργών κατηγοριών', summary: err.error, position: "topRight", duration: 4000});
          this.router?.navigateByUrl('home/landing');
        }
      });
    }
  }

  loadEmployee(data: any) {
    this.employee = JSON.parse(data);
    this.originalEmployee = JSON.parse(data);

    this.editEmployeeFormGroup.patchValue(this.employee);
    if(this.employee.supervisorId != null){
      this.editEmployeeFormGroup.get('supervisorId')?.setValue(this.employee.supervisorId);
    }else{
      this.editEmployeeFormGroup.get('supervisorId')?.setValue('0');
    }

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

  loadLeavesToTable(){
    if(this.leaveBalances != null){
      for(let i = 0; i < this.leaveBalances!.length; i++){
        let leaveTitle = this.leaveBalances[i]!.categoryTitle;
        let days = this.leaveBalances[i].days;
        let edited = 'old';
        let newLeaveData = {edited, leaveTitle, days};
        this.leaveDataTable.push(newLeaveData);
      }
      this.updateLeaveData();
    }
  }

  onAddLeave(){
    if(this.selectLeaveCategoryFormGroup != null){
      let leaveTitle = this.selectLeaveCategoryFormGroup.get('title')?.value;
      let days: number = parseInt(this.selectLeaveCategoryFormGroup.get('days')?.value, 10);
      let edited = 'new'

      for(let i = 0; i < this.leaveDataSource.data.length; i++){
        if(this.leaveDataSource.data[i].leaveTitle === leaveTitle){
          this.leaveDataSource.data[i].days = this.leaveDataSource.data[i].days + days;
          this.leaveDataTable[i].days = this.leaveDataSource.data[i].days + days;
          this.leaveDataSource.data[i].edited = 'edited';
          this.toast.info({detail: 'Προσθήκη άδειας', summary: 'Η άδεια ενημερώθηκε με επιτυχία', position: "topRight", duration: 2000})
        }else{
          const newLeaveData = {edited, leaveTitle, days};
          this.leaveDataTable.push(newLeaveData);
          this.updateLeaveData();
          this.toast.info({detail: 'Προσθήκη άδειας', summary: 'Η άδεια προστέθηκε με επιτυχία', position: "topRight", duration: 2000})
        }
      }
      this.editLeaves = false
    }
  }

  onEditLeave(){
    if(this.selectLeaveCategoryFormGroup != null && this.selectedRowOfLeaveTable != null){
      let leaveTitle = this.selectLeaveCategoryFormGroup.get('title')?.value;
      let days: number = this.selectLeaveCategoryFormGroup.get('days')?.value;
      let edited = 'edited';
      const newLeaveData = {edited, leaveTitle, days};
      this.leaveDataTable[this.selectedRowOfLeaveTable] = newLeaveData;
      this.leaveDataSource.data[this.selectedRowOfLeaveTable] = newLeaveData;
      this.editLeaves = false
      this.isLeaveBalanceEdited = false;
      this.selectedRowOfLeaveTable = undefined;
      this.toast.info({detail: 'Επεξεργασία άδειας', summary: 'Η επεξεργασία άδειας έγινε με επιτυχία', position: "topRight", duration: 2000})
    }
  }

  editLeave(event: Event, row: number){
    const cell = event.target as HTMLElement;
    const rowData = this.getRowDataFromCell(cell);
    console.log(rowData);
    if(rowData){
      this.selectedRowOfLeaveTable = row;
      this.editLeaves = true;
      this.isLeaveBalanceEdited = true;
      this.selectLeaveCategoryFormGroup = new FormGroup({
        title: new FormControl(rowData.leaveTitle, [Validators.required]),
        days: new FormControl(rowData.days, [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9]*$")])
      });
    }
  }

  getRowDataFromCell(cell: HTMLElement) {
    const row = cell.parentElement?.parentElement?.parentElement;
    if (row && row.parentElement?.parentElement) {
      const rowIndex = Array.from(row.parentElement?.children).indexOf(row) - 1;
      return this.leaveDataSource.data[rowIndex];
    }else return undefined;
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
