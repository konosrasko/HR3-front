import { Component } from '@angular/core';
import { ProfileService } from '../profile.service';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})


export class ProfileComponent {

  constructor(private profileService: ProfileService){}

  ngOnInit(){
    console.log("hello world", this.profileService)
  
    console.log("fetching...")
    this.profileService.myProfile().subscribe(data =>{
      console.log(data)

    })
  }

}
