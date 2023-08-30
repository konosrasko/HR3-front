import {Component} from '@angular/core';
import {Employee} from "../../../../models/employee.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../../../services/user.service";
import {EmployeeService} from "../../../../services/employee.service";
import {NgToastService} from "ng-angular-popup";
import {DatePipe} from "@angular/common";
import {Supervisors} from "../../../../models/supervisors";
import {LeaveCategory} from "../../../../models/leave-category.model";
import {LeaveBalance} from "../../../../models/leave_balance.model";
import {LeaveCategoryService} from "../../../../services/leave-category.service";
import {MatTableDataSource} from "@angular/material/table";
import {HttpStatusCode} from "@angular/common/http";

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
  supervisors?: Supervisors[];
  supervisor?: Supervisors;
  editEmployeeFormGroup: FormGroup;
  selectLeaveCategoryFormGroup?: FormGroup;
  leaveDataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['title', 'days', 'options'];
  leaveDataTable: any = [];
  selectedEmployeeId?: number;
  isEditMode: boolean = false;
  dataLoaded: boolean = false;
  editLeaves: boolean = false;
  isEmployeeEnabled?: boolean;
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
      address: new FormControl('', [Validators.required, Validators.maxLength(45), Validators.pattern(/^[A-Za-zΑ-Ωα-ωΆ-Ώά-ώ0-9\s,]*$/)]),
      mobileNumber: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern("^[0-9]*$")]),
      hireDate: new FormControl('', [Validators.required]),
      enabled: new FormControl('', [Validators.required]),
      supervisorId: new FormControl('', [Validators.required])
    })
  }

  ngOnInit(): void {
    if (this.selectedEmployeeId != null) {
      this.employeeService.getFilterSupervisors(this.selectedEmployeeId).subscribe({
        next: data => {
          this.loadSupervisor(data);
        },
        error: error => {
          this.toast.error({detail: "Πρόβλημα φόρτωσης Προισταμένων", summary: error.error, position: "topRight", duration: 4000});
          this.router?.navigateByUrl('home/hr/all-employees');
        }
      });

      this.employeeService.getEmployeeById(this.selectedEmployeeId).subscribe({
        next: data => {
          this.loadEmployee(data);
          this.dataLoaded = true;
        },
        error: error => {
          this.toast.error({detail: "Πρόβλημα φόρτωσης στοιχείων εργαζομένου", summary: error.error, position: "topRight", duration: 4000});
          this.router?.navigateByUrl('home/hr/all-employees');
        }
      });

      this.employeeService.getLeaveBalancesOfAnotherEmployee(this.selectedEmployeeId).subscribe({
        next: data =>{
          this.leaveBalances = data;
          this.loadLeavesToTable();
        },
        error: err => {
          this.toast.error({detail: 'Πρόβλημα φόρτωσης αδειών εργαζομένων', summary: err.error, position: "topRight", duration: 4000});
          this.router?.navigateByUrl('home/hr/all-employees');
        }
      });

      this.leaveCategoryService.getActiveLeaveCategories().subscribe({
        next: data => this.loadCategories(data),
        error: err => {
          this.toast.error({detail: 'Πρόβλημα φόρτωσης ενεργών κατηγοριών', summary: err.error, position: "topRight", duration: 4000});
          this.router?.navigateByUrl('home/hr/all-employees');
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

    this.isEmployeeEnabled = this.employee.enabled;
  }

  loadSupervisor(data: any) {
    this.supervisors = JSON.parse(data);
  }

  loadCategories(data: any){
    this.leaveCategories = JSON.parse(data);
  }

  loadLeavesToTable(){
    if(this.leaveBalances != null){
      for(let i = 0; i < this.leaveBalances!.length; i++){
        let id = this.leaveBalances[i]!.id;
        let leaveTitle = this.leaveBalances[i]!.categoryTitle;
        let days = this.leaveBalances[i].days;
        let daysTaken = this.leaveBalances[i].daysTaken;
        let edited = 'old';
        let newLeaveData = {id, edited, leaveTitle, days, daysTaken};
        this.leaveDataTable.push(newLeaveData);
      }
      this.updateLeaveData();
    }
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

  onSavingNewLeave(){
    if(this.selectLeaveCategoryFormGroup != null){
      let id = 0;
      let leaveTitle = this.selectLeaveCategoryFormGroup.get('title')?.value;
      let days: number = parseInt(this.selectLeaveCategoryFormGroup.get('days')?.value, 10);
      let daysTaken = 0;
      let edited = 'new'
      let flag = false;
      let index = 0;

      for(let i = 0; i < this.leaveDataTable.length; i++){
        if(this.leaveDataTable[i].leaveTitle == leaveTitle){
          flag  = true;
          index = i;
        }
      }

      if(flag){
        this.leaveDataTable[index].days = parseInt(this.leaveDataSource.data[index].days, 10) + days;
        if(this.leaveDataTable[index].edited !== 'new'){
          this.leaveDataTable[index].edited = 'edited';
        }
        this.updateLeaveData();
        this.toast.info({detail: 'Προσθήκη άδειας', summary: 'Η άδεια ενημερώθηκε με επιτυχία', position: "topRight", duration: 2000});
      }else{
        const newLeaveData = {id, edited, leaveTitle, days, daysTaken};
        this.leaveDataTable.push(newLeaveData);
        this.updateLeaveData();
        this.toast.info({detail: 'Προσθήκη άδειας', summary: 'Η άδεια προστέθηκε με επιτυχία', position: "topRight", duration: 2000});
      }
      this.editLeaves = false
    }else{
      this.toast.error({detail: 'Αποτυχία προσθήκης άδειας', summary: 'Υπήρξε πρόβλημα με την προσθήκη άδειας', position: "topRight", duration: 2000})
    }
  }

  onSavingEditedLeave(){
    if(this.selectLeaveCategoryFormGroup != null && this.selectedRowOfLeaveTable != null){
      let id = this.leaveDataTable[this.selectedRowOfLeaveTable].id;
      let leaveTitle = this.selectLeaveCategoryFormGroup.get('title')?.value;
      let days: number = parseInt(this.selectLeaveCategoryFormGroup.get('days')?.value, 10);
      let daysTaken = this.leaveDataTable[this.selectedRowOfLeaveTable].daysTaken;
      let edited;
      if(this.leaveDataTable[this.selectedRowOfLeaveTable].edited !== 'new'){
        edited = 'edited';
      }else{
        edited = 'new';
      }
      this.leaveDataTable[this.selectedRowOfLeaveTable] = {id, edited, leaveTitle, days, daysTaken};
      this.updateLeaveData();
      this.editLeaves = false
      this.isLeaveBalanceEdited = false;
      this.selectedRowOfLeaveTable = undefined;
      this.toast.info({detail: 'Επεξεργασία άδειας', summary: 'Η επεξεργασία άδειας έγινε με επιτυχία', position: "topRight", duration: 2000})
    }else{
      this.toast.error({detail: 'Αποτυχία επεξεργασίας', summary: 'Η επεξεργασία άδειας απέτυχε λόγω προβληματος', position: "topRight", duration: 2000})
    }
  }

  onClickForEditALeave(event: Event, row: number){
    const cell = event.target as HTMLElement;
    const rowData = this.getRowDataFromCell(cell);
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

  onDeleteRow(event: Event, row: number){
    const cell = event.target as HTMLElement;
    const rowData = this.getRowDataFromCell(cell);
    if(rowData){
      for(let i = 0; i < this.leaveDataTable.length; i++){
        if(this.leaveDataTable[i].leaveTitle == rowData.leaveTitle && this.leaveDataTable[i].days == rowData.days ){
          if(this.leaveDataTable[i].edited === 'old' || this.leaveDataTable[i].edited === 'edited'){
            this.leaveDataTable[i].edited = 'deleted';
          }else{
            this.leaveDataTable.splice(i, 1);
          }
        }
      }
      this.updateLeaveData();
      this.toast.info({detail: 'Διαγραφή άδειας', summary: 'Η άδεια διαγράφτηκε με επιτυχία', position: "topRight", duration: 2000})
    }
  }

  getRowDataFromCell(cell: HTMLElement) {
    const row = cell.parentElement?.parentElement?.parentElement;
    if (row && row.parentElement?.parentElement) {
      const rowIndex = Array.from(row.parentElement?.children).indexOf(row) - 1;
      return this.leaveDataSource.data[rowIndex];
    }else return undefined;
  }

  saveEditedEmployee() {
    if (this.editEmployeeFormGroup.valid) {
      this.employee = this.editEmployeeFormGroup.value;
      this.employee.employeeId = this.originalEmployee.employeeId;
      this.employee.hireDate = this.date.transform(this.employee.hireDate, 'yyyy-MM-dd');
      if(this.editEmployeeFormGroup.get('supervisorId')?.value === '0') {
        this.employee.supervisorId = undefined;
      }

      this.userService.saveEmployeeDetails(this.employee).subscribe({
        next: () => {
          this.saveEditedLeaveBalance();
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

  saveEditedLeaveBalance(){
    if(this.employee.employeeId != null){
      for(let i = 0; i < this.leaveDataTable.length; i ++){
        if(this.leaveDataTable[i].edited === 'new'){
          let newLeaveBalance = new LeaveBalance()
          newLeaveBalance.id = 0;
          newLeaveBalance.days = this.leaveDataTable[i].days;
          newLeaveBalance.daysTaken = 0;
          newLeaveBalance.categoryTitle = this.leaveDataTable[i].leaveTitle;
          this.employeeService.addNewLeaveBalanceToEmployee(this.employee.employeeId, newLeaveBalance).subscribe({
            next: () => {
            },
            error: err => {
              this.toast.error({detail: 'Πρόβλημα αποθήκευσης άδειας!', summary: err.error, position: "topRight", duration: 4000});
            }
          });
        }else if(this.leaveDataTable[i].edited === 'edited'){
          let editedLeaveBalance = new LeaveBalance();
          editedLeaveBalance.id = this.leaveDataTable[i].id;
          editedLeaveBalance.days = this.leaveDataTable[i].days;
          editedLeaveBalance.categoryTitle = this.leaveDataTable[i].leaveTitle;
          editedLeaveBalance.daysTaken = this.leaveDataTable[i].daysTaken;
          this.employeeService.editLeaveBalanceOfEmployee(this.employee.employeeId, editedLeaveBalance).subscribe({
            next: () => {},
            error: err => {
              this.toast.error({detail: 'Πρόβλημα επεξεργασίας άδειας!', summary: err.error, position: "topRight", duration: 4000});
            }
          });
        }else if(this.leaveDataTable[i].edited === 'deleted'){
          this.employeeService.deleteLeaveBalanceOfEmployee(this.employee.employeeId, this.leaveDataTable[i].id).subscribe({
            next: () => {},
            error: err => {
              this.toast.error({detail: 'Πρόβλημα διαγραφής άδειας!', summary: err.error, position: "topRight", duration: 4000});
          }
          })
        }
      }
      this.toast.success({detail: 'Επιτυχής Αποθήκευση!', summary: 'Η επεξεργασία των στοιχείων του εργαζομένου έγινε με επιτυχία!', position: "topRight", duration: 5000});
      this.router?.navigateByUrl('home/hr/all-employees');
    }else {
      this.toast.error({detail: 'Δεν έγινε αποθήκευση!', summary: 'Υπήρξε πρόβλημα με τον εργαζόμενο!', position: "topRight", duration: 5000});
    }
  }

  cancelEdit() {
    this.router?.navigateByUrl('home/hr/all-employees');
  }

  updateLeaveData(){
    let newLeaveData = [...this.leaveDataTable];
    for(let i = 0; i < 2; i++){
      newLeaveData.forEach((value, index) => {
        if(value.edited === 'deleted'){
          newLeaveData.splice(index, 1);
        }
      });
    }
    this.leaveDataSource.data = newLeaveData;
  }

  reloadPage(){
    this.ngOnInit();
    this.leaveDataSource = new MatTableDataSource<any>([]);
    this.leaveDataTable = [];
    this.isEditMode = false;
    this.dataLoaded = false;
    this.editLeaves = false;
    this.isLeaveBalanceEdited = false;
    this.toast.info({detail: 'Επαναφορά προεπιλογών', summary: 'Τα δεδομένα του εργαζομένου επαναφέρθηκαν στην αρχική τους κατάσταση!', position: "topRight", duration: 5000});
  }

  public myError = (controlName: string, errorName: string) => {
    return this.editEmployeeFormGroup.controls[controlName].hasError(errorName);
  }
}
