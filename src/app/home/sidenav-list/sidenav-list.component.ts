import { Component } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent {
  isSubmenuVisible = false;

  constructor(private router: Router) {
  }

  showSubmenu() {
    this.isSubmenuVisible = true;
  }

  hideSubmenu() {
    this.isSubmenuVisible = false;
  }

  navigateTo(componentToOpen: String) {
    this.router.navigateByUrl('/home/' + componentToOpen);
  }
}
