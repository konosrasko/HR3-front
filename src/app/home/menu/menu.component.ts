import {Component} from '@angular/core';
import {Router} from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent  {

  isMobileDropdownVisible: boolean = false;
  username?: String

  constructor(private router: Router, private userService: UserService) {
    this.userService.getUserRoles().subscribe({
      next: data =>{if(data) this.username = data.username},
      error: ()=>{console.log("Unable to get username")}
    })
  }

  navigateTo(componentToOpen: String){
    this.router.navigateByUrl('/home/' + componentToOpen);
  }

  doLogout(): void{
    localStorage.clear();
    this.router.navigateByUrl("/login");
  }

  toggleMobileDropdown() {
    this.isMobileDropdownVisible = !this.isMobileDropdownVisible;
  }

}
