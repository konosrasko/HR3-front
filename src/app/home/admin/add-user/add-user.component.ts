import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Employee} from "../../../models/employee.model";
import {Router} from "@angular/router";
import {UserService} from "../../../services/user.service";
import {EmployeeService} from "../../../services/employee.service";
import {User} from "../../../models/user.model";
import {NgToastService} from "ng-angular-popup";
import {HttpStatusCode} from '@angular/common/http';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})

export class AddUserComponent implements OnInit{
  allEmployees?: Employee[];
  newUserFormGroup: FormGroup;
  selectedEmployee = 0;
  selectedRole = "";
  username = "";
  password = "";
  isSupervisor: boolean = false;
  hide = true;

  constructor(private router: Router,private userService: UserService, private employeeService: EmployeeService, private toast: NgToastService ) {
    this.newUserFormGroup = new FormGroup({
      usernameFromControl: new FormControl({value: '', disabled: true}, [Validators.required, Validators.pattern(/^([a-zA-Z]+|[\u10D0-\u10F0]+)$/)]),
      passwordFormControl: new FormControl({value: '', disabled: true}, [Validators.required]),
      employeesFormControl: new FormControl('', [Validators.required]),
      rolesFormControl: new FormControl({value: '', disabled: true}, [Validators.required]),
      isSupervisorFormControl: new FormControl({value: '' || '2', disabled: true}, [Validators.required])
    })
  }

  ngOnInit() {
      this.employeeService.getEmployeesWithoutUser().subscribe({
        next: data =>{
          this.loadEmployeeData(data);
        },
        error: err => {
          if(err.status === HttpStatusCode.GatewayTimeout){
            this.toast.error({detail: 'Αποτυχία!', summary: 'Υπήρξε πρόβλημα στην επικοινωνία με τον server!', position: "topRight", duration: 3000});
          } else {
            this.toast.error({detail: 'Αποτυχία!', summary: err.error, position: "topRight", duration: 3000});
          }
          this.router?.navigateByUrl('home/landing');
        }
      });
  }

  loadEmployeeData(data: any){
    this.allEmployees = JSON.parse(data);
    if(this.allEmployees!.length <= 0){
      this.toast.warning({detail: 'Ενημέρωση', summary: 'Δεν υπάρχουν εργαζόμενοι χωρίς λογαριασμό!', position: "topRight", duration: 3000});
    }
  }

  onSelectEmployee() {
    this.newUserFormGroup.get('usernameFromControl')?.enable();
    this.newUserFormGroup.get('passwordFormControl')?.enable();
    this.newUserFormGroup.get('rolesFormControl')?.enable();
    this.newUserFormGroup.get('isSupervisorFormControl')?.enable();

  }

  getErrorUsername() {
    if (this.newUserFormGroup.get('usernameFromControl')?.hasError('required')) {
      return 'Πρέπει να εισάγεις username';
    }else if(this.newUserFormGroup.get('usernameFromControl')?.hasError('pattern')){
      return 'Δεκτοί μόνο Λατινικοί χαρακτήρες';
    }else {
      return ""
    }
  }

  getErrorPass(){
    if(this.newUserFormGroup.get('passwordFormControl')?.hasError('required')){
      return 'Πρέπει να εισάγεις password';
    }else {
      return "ok :)"
    }
  }

  saveNewUser(){
    let newUser: User = new User(0, this.username, this.password, true, (this.selectedEmployee), 'Employee', this.isSupervisor);

    if(this.selectedRole == 'employee'){
      newUser.role = 'Employee';
    }else if(this.selectedRole == 'hr'){
      newUser.role = 'HR';
    }else if(this.selectedRole == 'admin'){
      newUser.role = 'Admin'
    }

    this.userService.createUserAccount(newUser).subscribe({
      next: data => {
        this.toast.success({detail: 'Επιτυχής Αποθήκευση!', summary: 'Ο νέος λογαριασμός δημιουργήθηκε με επιτυχία!', position: "topRight", duration: 5000});
        this.router?.navigateByUrl('/home/admin');
      },
      error: err => {
        this.toast.error({detail: 'Αποτυχία!', summary: err.error, position: "topRight", duration: 5000})
      }
    });

  }

  navigateTo(){
    this.router?.navigateByUrl('home/admin');
  }
}
