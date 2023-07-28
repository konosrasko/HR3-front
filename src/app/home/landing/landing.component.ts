import { Component } from '@angular/core';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  public user:User;

  constructor(){
    var storedUser = localStorage.getItem('currentUser');
    if(storedUser){
      this.user = JSON.parse(storedUser);
    }
    else{
      this.user = new User(1, "Guest", "123", true, 0, "Guest")
    }
  }
}
