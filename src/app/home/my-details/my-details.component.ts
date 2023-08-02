// my-details.component.ts

import { Component, OnInit } from '@angular/core';
import { Employee } from 'src/app/models/employee.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-my-details',
  templateUrl: './my-details.component.html',
  styleUrls: ['./my-details.component.scss']
})
export class MyDetailsComponent implements OnInit {
  employee: Employee = new Employee();
  originalEmployee: Employee = new Employee(); // Store a copy of the original employee

  isEditMode: boolean = false;
  isSaveMode: boolean = false;

  constructor(private userService: UserService) {
    console.log('MyDetailsComponent constructor');
  }

  enableEditMode() {
    // Make a copy of the original employee to revert changes if canceled
    this.originalEmployee = { ...this.employee };
    this.isEditMode = true;
  }

  saveDetails() {
    this.userService.saveEmployeeDetails(this.employee).subscribe(
      (data) => {
        this.isEditMode = false;
        this.isSaveMode = true;
      }
    )
  }

  cancelEdit() {
    this.employee = { ...this.originalEmployee };
    this.isEditMode = false;
  }

  ngOnInit(): void {
    this.employee = {
      id: 1,
      firstName: "Stamatis",
      lastName: "Chatzis",
      email: "schatzis@ots.gr",
      mobileNumber: 231063243,
      address: "Panadreoy 164 Neapoli",
      hireDate: new Date(),
      enabled: true,
      supervisorId: 0
    };
  }
}
