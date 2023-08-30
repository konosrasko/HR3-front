import {Component} from '@angular/core';
import {UserService} from "../services/user.service";
import {ActivatedRoute, Router} from '@angular/router';
import {TokenController} from '../services/token_controller';
import {NgToastService} from 'ng-angular-popup';
import {HttpStatusCode} from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends TokenController {
  username: string = ''
  password: string = ''
  newPassword: string = ''
  newPasswordConfirm: string = ''
  error: string = ''
  token?: string;
  user: any;
  newPasswordMode: boolean = false;
  tokenExpired: boolean = false;

  constructor(private userService: UserService, router: Router, private route: ActivatedRoute, private toast: NgToastService) {
    super(router)

    const savedToken = localStorage.getItem("token");
    //if token is in local storage
    if (savedToken) {
      if (this.tokenIsValid(savedToken)) {
        //redirect to home page if it's valid
        this.getRouter().navigate(['/home/landing']);
      }
      else {
        //remove it if it's invalid
        localStorage.setItem("token", "");
      }
    }

    //look for error message param in case of redirect
    this.route.queryParams.subscribe(params => {
      if (params["error"]) {
        this.error = params["error"]
      }
      if(params["tokenExpired"]){
        this.tokenExpired = params["tokenExpired"]
        if(this.tokenExpired){
          this.userService.Logout().subscribe(data =>
          {
            this.toast.success({ detail: 'Επιτυχής Αποσύνδεση!', position: "topRight", duration: 3000 })
          })
          localStorage.clear();
        }
      }
    })

  }

  doLogin() {
    this.userService.Login(this.username, this.password).subscribe({
      next: data => {
        this.token = data.token;

        if (this.token != null) {
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
      error: error => {
        this.toast.error({
          detail: 'Αποτυχία!',
          summary: error.status === HttpStatusCode.GatewayTimeout ? "Πρόβλημα σύνδεσης με τον διακομιστή" : error.error,
          position: "topRight", duration: 4000
        });
      }


    });
  }

  changePassword() {
    if (this.newPassword == this.newPasswordConfirm) {
      this.user.password = this.newPassword;
      this.user.passTemp = false;
      this.userService.editUserAccount(this.user, true, this.user.id).subscribe({
        next: data => {
          this.toast.success({
            detail: 'Επιτυχία!',
            summary: "Ο κωδικός σας ενημερώθηκε επιτυχώς.",
            position: "topRight", duration: 4000
          })
          this.toast.success({ detail: 'Επιτυχής Αποθήκευση!', summary: 'Η επεξεργασία του λογαριασμού έγινε με επιτυχία!', position: "topRight", duration: 5000 });
          this.getRouter()?.navigate(['/home/landing']);
        },
        error: error => {
          this.toast.error({ detail: 'Αποτυχία!', summary: error.error, position: "topRight", duration: 5000 });
        }
      })

    }
    else {
      this.toast.error({
        detail: 'Aποτυχία!',
        summary: "Οι κωδικοί που παρέιχατε δε ταιριάζουν.",
        position: "topRight", duration: 4000
      })
    }
  }

  checkIfUserIsEnabled() {
    this.userService.getUserDetails().subscribe({
      next: data => {
        if (data) {
          this.user = data
          if (data.enable) {
            if (!this.user.passTemp) {
              this.getRouter()?.navigate(['/home/landing']);
            }
            else {
              this.openNewPasswordForm()
            }
          } else {
            this.error = "Ο λογαριασμός ειναι απενεργοποιημένος. Δεν έχετε δικαίωμα πρόσβασης."
          }
        }
      },
      error: error => {
        this.toast.error({
          detail: 'Αποτυχία!',
          summary: error.status === HttpStatusCode.GatewayTimeout ? "Πρόβλημα σύνδεσης με τον διακομιστή" : error.error,
          position: "topRight", duration: 4000
        });
      }
    })
  }

  openNewPasswordForm() {
    this.newPasswordMode = true;
  }
}
