import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { EmployeeUser } from "../../../models/employeeUser.model";
import { UserService } from "../../../services/user.service";
import { User } from "../../../models/user.model";
import {error} from "@angular/compiler-cli/src/transformers/util";
import * as CryptoJS from "crypto-js";
import {NgToastService} from "ng-angular-popup";

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})

export class EditUserComponent implements OnInit{

  token: string | null = localStorage.getItem('token');
  employeeUser?: EmployeeUser;

  hide = true;
  selectedUser = '';
  isSupervisor?: string = '';
  isLoaded: boolean = false;
  oldPass: string = '';
  editUserFormGroup: FormGroup;
  isEdited = false;

  constructor(private router: Router, private route:ActivatedRoute, private userService: UserService, private toast: NgToastService) {
    this.route.queryParams.subscribe(params=>{
      this.selectedUser = params["user"];
    });
    this.editUserFormGroup = new FormGroup({
      usernameFormControl: new FormControl('', [Validators.required]),
      passwordFormControl: new FormControl(''),
      rolesFormControl: new FormControl('', [Validators.required]),
      isEnabledFormControl: new FormControl('', [Validators.required]),
      isSupervisorFormControl: new FormControl('', [Validators.required])
    })
  }

  ngOnInit() {
    if(this.token != null){
      this.userService.getUserEmployeeDetails(this.token, this.selectedUser).subscribe({
        next: data => this.loadEmployeeUserData(data),
        error: error => {
          console.log(error);
          this.toast.error({detail: 'Αποτυχία!', summary: 'Δεν έχεις δικαιώματα Admin ή υπήρξε πρόβλημα στην επικοινωνία με τον server!', position: "topRight", duration: 3000});
          this.router?.navigateByUrl('/home/admin');
        }
      });
    }else{
      this.toast.error({detail: 'Αποτυχία!', summary: 'Δεν έχεις συνδεθεί! Κάνε log-in για να συνεχίσεις', position: "topRight", duration: 3000})
      this.router?.navigateByUrl('/login');
    }
  }

  loadEmployeeUserData(data: any){
    let sv_value: string
    this.employeeUser = JSON.parse(data);

    if(this.employeeUser?.supervisor){sv_value = '1'}else{sv_value = '2'}

    this.editUserFormGroup.controls['usernameFormControl'].setValue('' || this.employeeUser!.username);
    this.editUserFormGroup.controls['rolesFormControl'].setValue(this.employeeUser!.role.toLowerCase());
    this.editUserFormGroup.controls['isEnabledFormControl'].setValue(this.employeeUser?.enabled);
    this.editUserFormGroup.controls['isSupervisorFormControl'].setValue(sv_value);

    this.oldPass = this.employeeUser!.password;

    this.isLoaded = true;
  }

  getErrorUsername() {
    if (this.editUserFormGroup.get('usernameFormControl')?.hasError('required')) {
      return 'Πρέπει να εισάγεις username';
    } else {
      return "ok :)"
    }
  }

  navigateTo() {
    this.router?.navigateByUrl('home/admin');
  }

  onEdited(){
    this.isEdited = true;
  }

  saveEditUser(){
    let editedUser: User = new User(this.employeeUser!.userId, this.editUserFormGroup.get('usernameFormControl')!.value, this.editUserFormGroup.get('passwordFormControl')!.value, this.editUserFormGroup.get('isEnabledFormControl')!.value, this.employeeUser!.employeeId, 'Admin', false);

    if(this.editUserFormGroup.get('rolesFormControl')?.value == 'employee'){
      editedUser.role = 'Employee';
    }else if(this.editUserFormGroup.get('rolesFormControl')?.value == 'hr'){
      editedUser.role = 'HR';
    }else if(this.editUserFormGroup.get('rolesFormControl')?.value == 'admin'){
      editedUser.role = 'Admin'
    }

    if(this.isSupervisor == '1'){
      editedUser.supervisor = true;
    }else if(this.isSupervisor == '2'){
      editedUser.supervisor = false;
    }

    if(this.editUserFormGroup.get('passwordFormControl')!.value == ''){
      editedUser.password = this.oldPass;
    }

    //console.log(editedUser);

    if(this.token != null){
      this.userService.editUserAccount(editedUser, this.token, editedUser.id).subscribe({
        next: data=> {
          this.toast.success({detail: 'Επιτυχής Αποθήκευση!', summary: 'Η επεξεργασία του λογαριασμού έγινε με επιτυχία!', position: "topRight", duration: 5000});
          this.navigateTo();
        },
        error: error => {
          console.log(error);
          this.toast.error({detail: 'Αποτυχία!', summary: 'Λόγω προβλήματος δεν έγινε η επεργασία των στοιχείων!', position: "topRight", duration: 5000});
        }
      });
    }
  }
}
