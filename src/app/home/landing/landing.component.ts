import { Component } from '@angular/core';
import { LeaveBalance } from 'src/app/models/leave_balance.model';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  public user?:User;

  constructor(){
    var storedUser = localStorage.getItem('currentUser');
    if(storedUser){
      this.user = JSON.parse(storedUser);
    }

    this.getTakenLeaves()

  }

  getTakenLeaves(): LeaveBalance[]{
    if (this.user?.employeeId!=null){
      /*
      this.employeeService.getTakenLeaves(this.currentUser.employeeId, this.currentUser.username, this.currentUser.password).subscribe(data => {
        console.log(data)
      });
      Replace with this when security works */

      //fake data
      var data:LeaveBalance[] = [{
        "id": 2,
        "category": "Κανονική",
        "days": 5,
        "daysTaken": 3
      },
      {
        "id": 3,
        "category": "Αιμοδοσίας",
        "days": 1,
        "daysTaken": 1
      },
    ]

      var leaves: LeaveBalance[] = []
      leaves = leaves.concat(data)
      return leaves
      
    }
    else{
      return []
    }
    
  }
}
