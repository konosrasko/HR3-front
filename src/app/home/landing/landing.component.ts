import { error } from '@angular/compiler-cli/src/transformers/util';
import { Component } from '@angular/core';
import { LeaveBalance } from 'src/app/models/leave_balance.model';
import { User } from 'src/app/models/user.model';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  public user?:User;

  constructor(private employeeService:EmployeeService){
    
    this.getTakenLeaves()

  }

  getTakenLeaves(){

    var leaves: LeaveBalance[] = []

      this.employeeService.getTakenLeaves().subscribe(data => {
        console.log(data)

        //leaves = data
      }, (error => {
      }), ()=>{return leaves});
    
      return leaves

  }
}
