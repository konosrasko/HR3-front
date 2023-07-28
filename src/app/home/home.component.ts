import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(private userService: UserService, private router: Router) {
    const currentUserString = localStorage.getItem('currentUser');

    if (currentUserString !== null) {
      const currentUser = JSON.parse(currentUserString);
      console.log(currentUser)
    } else {
      console.log("none is logged in ")
      this.router.navigate([''])
    }

  }
}
