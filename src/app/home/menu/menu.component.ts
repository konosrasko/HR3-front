import {Component} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent  {

  isMobileDropdownVisible: boolean = false;

  constructor(private router: Router) {}

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
