import { Component } from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {EmployeeUser} from "../../../models/employeeUser.model";

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent {


  constructor(private router: Router, private route:ActivatedRoute) {
    this.route.queryParams.subscribe(params=>{
      const passedId=params["id"];
      console.log(passedId)
    })
  }

  Data: EmployeeUser= {
      "userId" : 1,
      "username" : "test",
      "password" : "123",
      "enabled" : true,
      "role" : "ADMIN",
      "firstName": "Stamatis",
      "lastName": "Chatzis",
      "supervisor": false,
    }
  selectedRole = this.Data.role.toLowerCase();

  username = new FormControl(''|| this.Data.username, [Validators.required]);
  password = new FormControl(''|| this.Data.password, [Validators.required]);
  roles = new FormControl(''|| this.selectedRole, [Validators.required]);

  hide = true;




  getErrorUsername() {
    if (this.username.hasError('required')) {
      return 'Πρέπει να εισάγεις username';
    } else {
      return "ok :)"
    }
  }

  getErrorPass() {
    if (this.password.hasError('required')) {
      return 'Πρέπει να εισάγεις password';
    } else {
      return "ok :)"
    }
  }

  onSelectRole(){

  }


  navigateTo() {
    this.router.navigateByUrl('home/admin');
  }

  protected readonly EmployeeUser = EmployeeUser;
}
