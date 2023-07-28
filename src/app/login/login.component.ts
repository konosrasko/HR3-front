import { Component, OnInit } from '@angular/core';
import { UserService } from "../services/user.service";
import { Router } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { User } from '../models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username: string = ''
  password: string = ''
  message: string = ''
  user: any;
  constructor(private userService: UserService, private router: Router) {
  }
  ngOnInit(): void {

    this.userService.currentUser$.subscribe(user => {
      if (user) {
        this.router.navigate(['/home']);
      }
      else{
        console.log("None is logged in.")
      }
    });

  }

  doLogin() {

    let response = this.userService.Login(this.username, this.password)
    response.subscribe(data => {
      this.user = data;

      if (this.user != null) {
        this.router.navigate(['/home']);
        this.userService.setCurrentUser(this.user);
        localStorage.setItem('currentUser', JSON.stringify(this.user));
      }
    }, (error => {
      alert("Λάθος στοιχεία")
    })
    );

  }
}
