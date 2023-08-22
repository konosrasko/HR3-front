import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from "../../services/user.service";
import {NgToastService} from "ng-angular-popup";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent  {

  isMobileDropdownVisible: boolean = false;
  username?:string = ''
  password:string = ''


  constructor(private router: Router, private userService: UserService,private toast:NgToastService) {
    this.userService.getUserRoles().subscribe({
      next: data =>{if(data) this.username = data.username},
      error: ()=>{console.log("Unable to get username")}
    })
  }

  navigateTo(componentToOpen: String){
    this.router.navigateByUrl('/home/' + componentToOpen);
  }

  doLogout(): void{

      this.userService.Logout().subscribe(data =>
      {
        this.toast.success({ detail: 'Επιτυχής Αποσύνδεση!', position: "topRight", duration: 3000 })
      })
    localStorage.clear();


  }

  toggleMobileDropdown() {
    this.isMobileDropdownVisible = !this.isMobileDropdownVisible;
  }

}
