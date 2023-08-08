import { error } from '@angular/compiler-cli/src/transformers/util';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LeaveBalance } from 'src/app/models/leave_balance.model';
import { User } from 'src/app/models/user.model';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  public user?:User;
  public takenLeaves?: LeaveBalance[];

  constructor(private employeeService:EmployeeService, private router: Router){}

  ngOnInit(): void {
    this.getEmployeeTakenLeaves()
  }

  getEmployeeTakenLeaves(){

    var leaves: LeaveBalance[] = []
      this.employeeService.getLeaveBalances().subscribe(data => {
        console.log(data)
        this.takenLeaves = data
      });
    
  }

  navigateTo(componentToOpen: String){
    this.router.navigateByUrl('/home/' + componentToOpen);
  }
}
