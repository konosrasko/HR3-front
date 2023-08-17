import {Component} from '@angular/core';
import {UserService} from '../services/user.service';
import {Router} from '@angular/router';
import {User} from '../models/user.model';
import {EmployeeService} from '../services/employee.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  private currentUser?:User

  constructor(private userService: UserService, private employeeService:EmployeeService, private router: Router) {
    const currentUserString = localStorage.getItem('currentUser');

    // if (currentUserString !== null) {
    //   this.currentUser = JSON.parse(currentUserString);
    //   console.log(this.currentUser)
    // } else {
    //   console.log("none is logged in ")
    //   this.router.navigate(['/login'])
    // }
  }



}
