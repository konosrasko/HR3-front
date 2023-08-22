import {Component, HostListener} from '@angular/core';
import {UserService} from "./services/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private userService: UserService,private router:Router) {
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {

    this.userService.Logout().subscribe(
      () => {
        $event.returnValue = 'You are logged out.';
        this.router.navigate(["/login"])
      },
      (error) => {
        console.error('Logout failed:', error);
      }
    );
  }

}
