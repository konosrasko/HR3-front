import {Component} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-sidenav-item',
  templateUrl: './sidenav-item.component.html',
  styleUrls: ['./sidenav-item.component.scss']
})
export class SidenavItemComponent {
  constructor(private router:Router) {
  }

  navigateTo(componentToOpen: String) {
    this.router.navigateByUrl('/home/' + componentToOpen);
  }
}
