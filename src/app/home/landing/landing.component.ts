import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Employee} from 'src/app/models/employee.model';
import {LeaveBalance} from 'src/app/models/leave_balance.model';
import {Roles} from 'src/app/models/roles.model';
import {EmployeeService} from 'src/app/services/employee.service';
import {UserService} from 'src/app/services/user.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  public roles: Roles = { role: "", supervisor: false };
  public takenLeaves?: LeaveBalance[];
  public name?: String
  constructor(private employeeService: EmployeeService, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.getEmployeeTakenLeaves()
    this.getUserRoles()
    this.getName()
  }


  getEmployeeTakenLeaves() {
    this.employeeService.getLeaveBalances().subscribe(data => {
      this.takenLeaves = data
    });
  }

  getUserRoles() {
    this.userService.getUserRoles().subscribe(data => {
      this.roles = data
      localStorage.setItem("role", String(this.roles.role));
      localStorage.setItem("isSupervisor", String(Boolean(this.roles.supervisor)));
    });
  }

  getName() {
    this.userService.getEmployeeDetails().subscribe({
      next: data => {
        if (data) {
          const employee: Employee = JSON.parse(data.toString());
          this.name = employee.firstName + " " + employee.lastName
        }
      },
      error: ()=>{}
    })
  }

  navigateTo(componentToOpen: String) {
    this.router.navigateByUrl('/home/' + componentToOpen);
  }

  protected readonly Date = Date;
}
