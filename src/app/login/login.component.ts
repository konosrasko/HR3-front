import { Component } from '@angular/core';
import { UserService } from "../services/user.service";
import { ActivatedRoute, Router } from '@angular/router';
import { TokenController } from '../services/token_controller';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends TokenController{
  username: string = ''
  password: string = ''
  error: string = ' '
  token?: string;
  user: any;
  constructor(private userService: UserService, router: Router, private route: ActivatedRoute) {
    super(router)

    const savedToken = localStorage.getItem("token");
    //if token is in local storage
    if (savedToken) {
      if(this.tokenIsValid(savedToken)){
        //redirect to home page if it's valid
        this.getRouter().navigate(['/home/landing']);
      }
      else{
        //remove it if it's invalid
        localStorage.setItem("token", "");
      }
    }

    //look for error message param in case of redirect
    this.route.queryParams.subscribe(params => {
      if(params["error"]){
        this.error = params["error"]
      }
    })

  }

  doLogin() {

    const response = this.userService.Login(this.username, this.password)
    response.subscribe(data => {
        this.token = data.token;
        console.log(data)

        if (this.token != null) {
            this.getRouter().navigate(['/home/landing']);
            localStorage.setItem('token', this.token);
        } else {
          this.getRouter().navigate(["/login"]);
        }
      }, (error => {
        this.error = "Λανθασμένο όνομα χρήστη η κωδικός. Παρακαλώ προσπαθήστε ξανά."
        console.log(this.error)
        this.getRouter().navigate(["/login"])
      })
    );

  }
}
