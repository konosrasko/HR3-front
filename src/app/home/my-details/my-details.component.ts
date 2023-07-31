import { Component,OnInit } from '@angular/core';
import { EmployeeComponent } from 'src/app/employee/employee.component';
import { Employee } from 'src/app/models/employee.model';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-my-details',
  templateUrl: './my-details.component.html',
  styleUrls: ['./my-details.component.scss']
})
export class MyDetailsComponent implements OnInit{
  employee: Employee= new Employee;

  constructor(private userService: UserService){}

  ngOnInit(): void {
    // this.userService.getEmployeeDetails().subscribe(
    //   (data) =>{
    //   this.employee = data;
    //   },
    //   (console)=>{
    //     console.log("error re ksilaaa");
      
    //   }
    //   );

    var data = { 
      "id": 1,
      "firstName": "Stamatis",
      "lastName": "Chatzis",
      "email": "schatzis@ots.gr",
      "mobileNumber": 231063243,
      "address": "Panadreoy 164 Neapoli",
      "hireDate": new Date,
      "enabled": true,
      "supervisorId": 0
  }

  this.employee=data;
  }

}
