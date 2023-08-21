import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {Roles} from 'src/app/models/roles.model';
import {UserService} from 'src/app/services/user.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent {
  isHRSubmenuVisible = false;
  isSupervisorSubmenuVisible = false;
  isSupervisor = false;
  isHR = false;
  isAdmin = false;

  constructor(private router: Router, private userService: UserService) {
    this.userService.getUserRoles().subscribe((data:Roles)=>{
      this.isSupervisor = data.supervisor? data.supervisor : false;
      this.isHR = data.role=="HR";
      this.isAdmin = data.role=="Admin";
    })
  }


  showSupervisorSubmenu() {
    this.isSupervisorSubmenuVisible = true;
  }

  hideSupervisorSubmenu() {
    this.isSupervisorSubmenuVisible = false;
  }

  showHRSubmenu() {
    this.isHRSubmenuVisible = true;
  }

  hideHRSubmenu() {
    this.isHRSubmenuVisible = false;
  }

  navigateTo(componentToOpen: String) {
    this.router.navigateByUrl('/home/' + componentToOpen);
  }
}
