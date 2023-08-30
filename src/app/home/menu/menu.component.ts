import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from "../../services/user.service";
import {NgToastService} from "ng-angular-popup";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit{

  isMobileDropdownVisible: boolean = false;
  username?:string = ''
  password:string = ''
  public minutes: number = 0;
  public seconds: number = 0;
  private countdownInterval: any;
  lessThanMinute = false;

  constructor(private router: Router, private userService: UserService,private toast:NgToastService) {
    this.userService.getUserRoles().subscribe({
      next: data =>{if(data) this.username = data.username},
      error: ()=>{}
    })
  }

  ngOnInit() {
    const targetTime = new Date(parseInt(localStorage.getItem('loginTime')!) + 30 * 60 * 1000);

    this.updateTimer(targetTime);

    this.countdownInterval = setInterval(() => {
      this.updateTimer(targetTime);
    }, 1000);
  }

  private updateTimer(targetTime: Date): void {
    const now = new Date();
    const timeDifference = targetTime.getTime() - now.getTime();

    this.minutes = Math.floor(timeDifference / 60000);
    this.seconds = Math.floor((timeDifference % 60000) / 1000);

    if(this.minutes <= 1){
      this.lessThanMinute = true
    }
    if (this.minutes === 0 && this.seconds === 0) {
      clearInterval(this.countdownInterval);
      this.userService.Logout().subscribe(data => {
        this.toast.warning({ detail: 'Αποσυνδεθήκατε', summary: 'Ο χρόνος σας έληξε', position: "topRight", duration: 3000 })
      });
    } else {
      if (this.seconds === 0) {
        this.minutes--;
        this.seconds = 59;
      } else {
        this.seconds--;
      }
    }
  }

  navigateTo(componentToOpen: String){
    this.router?.navigateByUrl('/home/' + componentToOpen);
  }

  doLogout(): void{
    this.userService.Logout().subscribe(data => {
      this.toast.success({ detail: 'Επιτυχής Αποσύνδεση!', position: "topRight", duration: 3000 })
    });
    localStorage.clear();
  }

  toggleMobileDropdown() {
    this.isMobileDropdownVisible = !this.isMobileDropdownVisible;
  }

}
