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
        // this.router.navigate(['/home/landing']);
      }
      else{
        console.log("None is logged in.")
        this.router.navigate(["/login"])
      }
    });

  }

  doLogin() {

    const response = this.userService.Login(this.username, this.password)
    response.subscribe(data => {
      this.user = data;

      if (this.user != null) {
        this.router.navigate(['/home/landing']);
        this.userService.setCurrentUser(this.user);
        localStorage.setItem('currentUser', JSON.stringify(this.user));
      } else {
        this.router.navigate(["/login"]);
      }
    }, (error => {
      alert("Λάθος στοιχεία")
      this.router.navigate(["/login"])
    })
    );

  }
}
