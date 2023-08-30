import {Component, HostListener, OnInit} from '@angular/core';
import {UserService} from "./services/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  constructor(private userService: UserService,private router:Router) {
  }

  @HostListener('window:unload', ['$event'])
  unloadNotification($event: any): void {

    this.userService.Logout().subscribe(
      () => {
        $event.returnValue = 'You are logged out.';

      },
      (error) => {
      }
    );
    this.router.navigate(["/login"])
  }

  ngOnInit(): void {
  }


}
