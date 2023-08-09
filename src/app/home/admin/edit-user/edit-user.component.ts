import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { EmployeeUser } from "../../../models/employeeUser.model";
import { UserService } from "../../../services/user.service";
import { User } from "../../../models/user.model";
import {error} from "@angular/compiler-cli/src/transformers/util";
import * as CryptoJS from "crypto-js";

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})

export class EditUserComponent implements OnInit{

  token: string | null = localStorage.getItem('token');
  employeeUser?: EmployeeUser;
  private secretKey = CryptoJS.enc.Utf8.parse('ba6d59d38168f98b'); // Secret key

  hide = true;
  selectedUser = '';
  isEnabled?: boolean;
  isSupervisor?: string = '';
  selectedRole?: string = '';
  usernameFormControl?:any;
  passwordFormControl?:any;
  rolesFormControl?:any;
  isEnabledFormControl?: any;
  isSupervisorFormControl?:any;

  constructor(private router: Router, private route:ActivatedRoute, private userService: UserService) {
    this.route.queryParams.subscribe(params=>{
      this.selectedUser = params["user"];
    })
  }

  ngOnInit() {
    if(this.token != null){
      this.userService.getUserEmployeeDetails(this.token, this.selectedUser).subscribe({
        next: data => this.loadEmployeeUserData(data),
        error: error => {
          console.log(error);
          this.router?.navigateByUrl('/home/admin');
        }
      });
    }else{
      this.router?.navigateByUrl('/login');
    }
  }

  loadEmployeeUserData(data: any){
    let enabled_value: string
    let sv_value: string
    this.employeeUser = JSON.parse(data);

    if(this.employeeUser?.enabled){enabled_value = "1"}else{enabled_value = "2"}
    if(this.employeeUser?.supervisor){sv_value = '1'}else{sv_value = '2'}

    this.usernameFormControl = new FormControl('' || this.employeeUser?.username, [Validators.required]);
    this.passwordFormControl = new FormControl('' || this.employeeUser?.password, [Validators.required]);
    this.rolesFormControl = new FormControl('' || this.employeeUser?.role.toLowerCase(), [Validators.required]);
    this.isEnabledFormControl = new FormControl('' || enabled_value, [Validators.required]);
    this.isSupervisorFormControl = new FormControl('' || sv_value, [Validators.required]);
    this.selectedRole = this.employeeUser?.role.toLowerCase();
    this.isEnabled = this.employeeUser?.enabled;
  }

  getErrorUsername() {
    if (this.usernameFormControl.hasError('required')) {
      return 'Πρέπει να εισάγεις username';
    } else {
      return "ok :)"
    }
  }

  getErrorPass() {
    if (this.passwordFormControl.hasError('required')) {
      return 'Πρέπει να εισάγεις password';
    } else {
      return "ok :)"
    }
  }

  navigateTo() {
    this.router?.navigateByUrl('home/admin');
  }

  saveEditUser(){
    let userAccount: User = new User(this.employeeUser!.userId, this.employeeUser!.username, this.employeeUser!.password, true, this.employeeUser!.employeeId, 'Admin', false);

    if(this.selectedRole == 'employee'){
      userAccount.role = 'Employee';
    }else if(this.selectedRole == 'hr'){
      userAccount.role = 'HR';
    }else if(this.selectedRole == 'admin'){
      userAccount.role = 'Admin'
    }

    if(this.isSupervisor == '1'){
      userAccount.supervisor = true;
    }else if(this.isSupervisor == '2'){
      userAccount.supervisor = false;
    }

    userAccount.enable = this.isEnabled;

    if(this.token != null){
      this.userService.editUserAccount(userAccount, this.token, userAccount.id).subscribe({
        next: data=> {
          alert("Οι αλλαγές αποθηκεύτηκαν")
        },
        error: error => console.log(error)
      });
    }
  }

  encryptData(data:String) {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), this.secretKey, {
        mode: CryptoJS.mode.ECB,
        format: CryptoJS.format.OpenSSL,
      }).toString();
    } catch (e) {
      console.log(e);
      return ''
    }
  }

  decryptData(data: string) {
    try {
      return CryptoJS.AES.decrypt(JSON.stringify(data), this.secretKey, {
        mode: CryptoJS.mode.ECB,
        format: CryptoJS.format.OpenSSL
      }).toString();
    } catch (e) {
      console.log(e);
      return '';
    }
  }
}
