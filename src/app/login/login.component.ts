import { Component, OnInit } from '@angular/core';
import { UserService } from "../services/user.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent{

  username: string = ''
  password: string = ''
  token!: string;
  user: any;
  constructor(private userService: UserService, private router: Router) {
  }

  doLogin() {

    if (!this.username || !this.password) {
      console.log("cringe")
      return;
    }


    const response = this.userService.Login(this.username, this.password)
    response.subscribe(data => {
        this.token = data.token;
        console.log(data)

        if (this.token != null) {

          this.userService.getUserData(this.token).subscribe(data =>
            console.log(data))
            this.router.navigate(['/home/landing']);
            localStorage.setItem('token', this.token);

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
 