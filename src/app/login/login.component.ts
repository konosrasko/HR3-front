import {Component} from '@angular/core';
import {UserService} from "../services/user.service";
import {ActivatedRoute, Router} from '@angular/router';
import {TokenController} from '../services/token_controller';
import {NgToastService} from "ng-angular-popup";

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
  constructor(private userService: UserService, router: Router, private route: ActivatedRoute, private toast: NgToastService) {
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
    this.userService.Login(this.username, this.password).subscribe({
      next: data =>{
        this.token = data.token;

        if(this.token != null){
          localStorage.setItem('token', this.token);
          this.checkIfUserIsEnabled();
        }else{
          if(localStorage.getItem('message')!='Welcome')
          {
            this.toast.error({ detail: 'Ειστε ήδη συνδεδεμένος από άλλη πηγή,αποσυνδεθείτε και προσπάθείστε ξανά', position: "topRight", duration: 3000 });
          }
            this.getRouter()?.navigate(["/login"]);

        }
      },
      error: err => {
        this.error = "Λανθασμένο όνομα χρήστη η κωδικός. Παρακαλώ προσπαθήστε ξανά."
        console.log(this.error)
        this.getRouter()?.navigate(["/login"])
      }


    });
  }

  checkIfUserIsEnabled(){
    this.userService.getUserDetails().subscribe({
      next: data => {

        if(data.enable){
          this.getRouter()?.navigate(['/home/landing']);
        }else{
          this.error = "Ο λογαριασμός ειναι απενεργοποιημένος. Δεν έχετε δικαίωμα πρόσβασης."
        }

      },
      error: err => {
        console.log(err);
        this.error = "Προέκυψε σφάλμα. Προσπαθήστε ξανά"
      }
    })
  }
}
