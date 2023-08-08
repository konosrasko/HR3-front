import {Component, OnInit,} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {EmployeeUser} from "../../../models/employeeUser.model";
import {UserService} from "../../../services/user.service";

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
    this.employeeUser = JSON.parse(data);
    if(this.employeeUser?.enabled){
      enabled_value = "1"
      console.log("energos");
    }else{
      enabled_value = "2"
      console.log("anenergos");
    }
    this.usernameFormControl = new FormControl('' || this.employeeUser?.username, [Validators.required]);
    this.passwordFormControl = new FormControl('' || this.employeeUser?.password, [Validators.required]);
    this.rolesFormControl = new FormControl('' || this.employeeUser?.role.toLowerCase(), [Validators.required]);
    this.isEnabledFormControl = new FormControl('' || enabled_value, [Validators.required]);
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

  onSelectRole(){

  }

  navigateTo() {
    this.router?.navigateByUrl('home/admin');
  }

}
