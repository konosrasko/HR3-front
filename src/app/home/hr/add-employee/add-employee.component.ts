import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { EmployeeService } from "../../../services/employee.service";
import { Employee } from "../../../models/employee.model";
import {DatePipe} from "@angular/common";
import {Supervisors} from "../../../models/supervisors";
import {NgToastService} from "ng-angular-popup";
import {MatTableDataSource} from "@angular/material/table";
import {LeaveCategory} from "../../../models/leave-category.model";
import {LeaveCategoryService} from "../../../services/leave-category.service";
import {LeaveBalance} from "../../../models/leave_balance.model";

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})

export class AddEmployeeComponent implements OnInit {
  addEmployeeFormGroup: FormGroup;
  selectLeaveCategoryFormGroup?: FormGroup;
  employee: Employee = new Employee();
  supervisors?: Supervisors[]
  leaveCategories?: LeaveCategory[];
  token: string | null= localStorage.getItem('token');
  selectedSupervisor?: Employee
  addingLeaves = false;
  hasRows = false
  leaveDataTable: any = [];
  leaveDataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['title', 'days', 'options'];
  selectedLeaveCategory = 0;

  constructor(private router: Router, private employeeService: EmployeeService, private datePipe: DatePipe, private toast: NgToastService, private leaveCategoryService: LeaveCategoryService) {
    this.addEmployeeFormGroup = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.maxLength(45), Validators.pattern(/^([a-zA-Zα-ωΑ-Ω]+|[\u10D0-\u10F0]+)$/)]),
      lastName: new FormControl('', [Validators.required, Validators.maxLength(45), Validators.pattern(/^([a-zA-Zα-ωΑ-Ω]+|[\u10D0-\u10F0]+)$/)]),
      email: new FormControl('', [Validators.required, Validators.maxLength(45), Validators.email]),
      mobileNumber: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern("^[0-9]*$")]),
      address: new FormControl('', [Validators.required, Validators.maxLength(45), Validators.pattern(/^([a-zA-Zα-ωΑ-Ω0-9]+|[\u10D0-\u10F0]+)$/)]),
      hireDate: new FormControl('', [Validators.required]),
      enabled: new FormControl('false'),
      supervisorId: new FormControl('', [Validators.required])
    });
  }


  ngOnInit(): void {
    if(this.token != null){
      this.employeeService.getAllSupervisors().subscribe({
        next: data => this.loadSupervisors(data),
        error: err => {
          console.log(err);
          this.toast.error({detail: 'Παρουσιάστηκε σφάλμα!', summary: err.error, position: "topRight", duration: 4000});
          this.router?.navigateByUrl('home/landing');
        }
      });
      this.leaveCategoryService.getActiveLeaveCategories().subscribe({
        next: data => this.loadCategories(data),
        error: err => {
          console.log(err);
          this.toast.error({detail: 'Παρουσιάστηκε σφάλμα!', summary: err.error, position: "topRight", duration: 4000});
          this.router?.navigateByUrl('home/landing');
        }
      })
    }else{
      this.toast.error({detail: 'Πρόβλημα σύνδεσης!', summary: 'Δεν έχεις συνδεθεί! Κάνε log-in για να συνεχίσεις', position: "topRight", duration: 4000})
      this.router?.navigateByUrl('/login');
    }
  }

  getIndexClass(row: any): string {
    const index = this.leaveDataSource.data.indexOf(row);
    return index % 2 === 0 ? 'even-row' : 'odd-row';
  }

  loadSupervisors(data: any){
    this.supervisors = JSON.parse(data);
  }
  loadCategories(data: any){
    this.leaveCategories = JSON.parse(data);
  }

  getEmailError(){
    if(this.addEmployeeFormGroup.get('email')?.hasError('required')){
      return 'Το πεδίο είναι υποχρεωτικό.';
    }else if(this.addEmployeeFormGroup.get('email')?.hasError('email')){
      return 'Εισήγαγε μια σωστή διεύθυνση e-mail.';
    }else{
      return '';
    }
  }

  getMobilePhoneError(){
    if(this.addEmployeeFormGroup.get('mobileNumber')?.hasError('required')){
      return 'Το πεδίο είναι υποχρεωτικό.';
    }else if(this.addEmployeeFormGroup.get('mobileNumber')?.hasError('maxlength') || this.addEmployeeFormGroup.get('mobileNumber')?.hasError('minlength')) {
      return 'Ο αριθμός πρέπει να είναι 10 νούμερα';
    }else if(this.addEmployeeFormGroup.get('mobileNumber')?.hasError('pattern')){
      return 'Πρέπει να εισάγεις μόνο αριθμούς';
    }else{
      return '';
    }
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

  onClickForAddLeave(){
    this.addingLeaves = true;
    this.selectLeaveCategoryFormGroup = new FormGroup({
      title: new FormControl('', [Validators.required]),
      days: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9]*$")])
    });
  }

  onAddLeave(){
    if(this.selectLeaveCategoryFormGroup != null){
      let valueSplit = this.selectLeaveCategoryFormGroup.get('title')?.value.split(',');
      let leaveTitle: string = valueSplit[1];
      let days: number = this.selectLeaveCategoryFormGroup.get('days')?.value;

      const newLeaveData = {leaveTitle, days};

      this.leaveDataTable.push(newLeaveData);
      this.updateLeaveData();

      this.addingLeaves = false
      this.hasRows = true;
      this.toast.info({detail: 'Προσθήκη άδειας', summary: 'Η άδεια προστέθηκε με επιτυχία', position: "topRight", duration: 2000})
    }
  }

  onDeleteRow(row: number){
    this.leaveDataTable.splice(row, 1);
    this.updateLeaveData();
    this.toast.info({detail: 'Διαγραφή άδειας', summary: 'Η άδεια διαγράφτηκε με επιτυχία', position: "topRight", duration: 2000})
  }

  onSubmit() {
    if(this.addEmployeeFormGroup.valid) {
      this.employee = this.addEmployeeFormGroup.value;
      this.employee.hireDate = this.datePipe.transform(this.employee.hireDate, 'yyyy-MM-dd')
      this.employee.enabled = true;

      if(this.addEmployeeFormGroup.get('supervisorId')?.value === '0'){
        this.employee.supervisorId = undefined;
      }

      this.employeeService.addNewEmployee(this.employee).subscribe({
        next: data=> {
          this.saveLeaveBalancesToNewEmployee(data);
        },
        error: err => {
          console.log(err);
          this.toast.error({detail: 'Αποτυχία προσθήκης εργαζομένου', summary: err.error, position: "topRight", duration: 5000});
        }
      });
    }else{
      this.toast.error({detail: 'Αποτυχία προσθήκης', summary: 'Συμπλήρωσε σωστά όλα τα πεδία', position: "topRight", duration: 5000});
    }
  }

  saveLeaveBalancesToNewEmployee(data: any){
    if(this.leaveDataTable.length > 0){
      let newEmployee: Employee;
      newEmployee = JSON.parse(data);

      for(let i = 0; i < this.leaveDataTable.length; i++){
        let newLeaveBalance = new LeaveBalance();
        newLeaveBalance.id = 0;
        newLeaveBalance.daysTaken = 0;
        newLeaveBalance.days = this.leaveDataTable[i].days;
        newLeaveBalance.categoryTitle = this.leaveDataTable[i].leaveTitle;

        if(newEmployee.employeeId != null) {
          this.employeeService.addNewLeaveBalanceToEmployee(newEmployee.employeeId, newLeaveBalance).subscribe({
            next: data => {
              this.toast.success({detail: 'Επιτυχής προσθήκη εργαζομένου', summary: 'Ο νέος εργαζόμενοςκ και οι άδειές του προστέθηκαν με επιτυχία!', position: "topRight", duration: 5000});
              this.navigateTo();
            },
            error: err => {
              console.log(err);
              this.toast.error({detail: 'Αποτυχία προσθήκης αδειών εργαζομένου', summary: err.error, position: "topRight", duration: 5000});
            }
          })
        }else {
          this.toast.error({detail: 'Αποτυχία προσθήκης αδειών εργαζομένου', summary: 'Πρόβλημα στον κωδικό του νέου εργαζομένο', position: "topRight", duration: 5000});
        }
      }
    }else{
      this.toast.success({detail: 'Επιτυχής προσθήκη εργαζομένου', summary: 'Ο νέος εργαζόμενος προστέθηκε με επιτυχία!', position: "topRight", duration: 5000})
      this.navigateTo();
    }
  }

  updateLeaveData(){
    this.leaveDataSource.data = this.leaveDataTable;
  }

  navigateTo() {
    this.router?.navigateByUrl('/home/hr/all-employees');
  }
}
