import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { LeaveRequestService } from 'src/app/services/leave_request.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { LeaveBalance } from 'src/app/models/leave_balance.model';
import {LeaveRequest} from "../../../models/leave_request.model";

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  providers: [DatePipe]
})
export class AddComponent {

  categoryControl = new FormControl('', [Validators.required]);
  categories: String[] = [];

  leaveRequestFormGroup: FormGroup = new FormGroup({
    title: this.categoryControl,
    duration: new FormControl(''),
    submitDate: new FormControl(''),
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required])
  })

  today = new Date();
  @ViewChild('endDatePicker') endDatePicker!: MatDatepicker<Date>;


  constructor(private leaveRequestService: LeaveRequestService, private employeeService: EmployeeService, private router: Router) {
    this.leaveRequestFormGroup.get('startDate')?.setValidators([Validators.required]);
    this.leaveRequestFormGroup.get('startDate')?.setValidators([this.validateStartDate()]);
    this.leaveRequestFormGroup.get('startDate')?.updateValueAndValidity();
    this.leaveRequestFormGroup.get('endDate')?.disable();
    this.leaveRequestFormGroup.get('duration')?.disable();
    this.leaveRequestFormGroup.get('submitDate')?.disable();
    this.leaveRequestFormGroup.get('submitDate')?.setValue(new Date)

    this.employeeService.getLeaveBalances().subscribe((data: LeaveBalance[]) => {
      data.forEach(lb => {
        if (lb.categoryTitle)
          this.categories.push(lb.categoryTitle);
      })
    })

    this.leaveRequestFormGroup.get('startDate')?.valueChanges.subscribe((value:Date) => {
    
      console.log("start date changed " + this.formatDate(value))
      const startDate = value ? new Date(value): null;

      // Enable the endDateControl and set its minimum date
      if (startDate) {
        this.leaveRequestFormGroup.get('endDate')?.enable();
        this.leaveRequestFormGroup.get('endDate')?.setValidators([Validators.required, this.validateEndDate(startDate)]);

        //update duration when startDate changes
        const endDate: Date | any = this.leaveRequestFormGroup.get('endDate')?.value ? new Date(this.leaveRequestFormGroup.get('endDate')?.value) : null;
        this.leaveRequestFormGroup.get('duration')?.setValue(this.getDurationWithoutWeekends(startDate, endDate))

      }
      this.leaveRequestFormGroup.get('endDate')?.updateValueAndValidity();

    });

    //update duration when endDate changes
    this.leaveRequestFormGroup.get('endDate')?.valueChanges.subscribe(value => {
      const startDate: Date = this.leaveRequestFormGroup.get('startDate')?.value ? new Date(this.leaveRequestFormGroup.get('startDate')?.value) : new Date();
      const endDate: Date = this.leaveRequestFormGroup.get('endDate')?.value ? new Date(this.leaveRequestFormGroup.get('endDate')?.value) : new Date();
      this.leaveRequestFormGroup.get('duration')?.setValue(this.getDurationWithoutWeekends(startDate, endDate))
    })
  }

  private validateStartDate(): any {
    return (control: FormControl) => {
      const startDate = control.value ? new Date(control.value) : null;
      return startDate && startDate >= new Date() ? null : { startDateInvalid: true };
    };
  }

  private validateEndDate(startDate: Date): any {
    return (control: FormControl) => {
      const endDate = control.value ? new Date(control.value) : null;
      return endDate && endDate >= startDate ? null : { endDateInvalid: true };
    };
  }

  getDurationWithoutWeekends(startDate: Date, endDate: Date): number {
    const oneDay = 1000 * 60 * 60 * 24; // Number of milliseconds in a day
    let duration = 0;
    let currentDate = startDate;

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // Exclude Sunday (0) and Saturday (6)
        duration++;
      }
      currentDate = new Date(currentDate.getTime() + oneDay);
    }

    return duration;
  }

  submit() {
    const newLeaveRequest:LeaveRequest = {
      leaveTitle: this.leaveRequestFormGroup.get('title')?.value,
      submitDate: this.formatDate(this.leaveRequestFormGroup.get('submitDate')?.value),
      startDate: this.formatDate(this.leaveRequestFormGroup.get('startDate')?.value),
      endDate: this.formatDate(this.leaveRequestFormGroup.get('endDate')?.value),
      duration: this.leaveRequestFormGroup.get('duration')?.value,
    }

    console.log(newLeaveRequest)

    this.leaveRequestService.newLeaveRequest(newLeaveRequest).subscribe(data => {
      console.log(data)
      alert("Επιτυχής δημιουργία αιτήματος")
      this.router.navigateByUrl('home/leaves/requests')
    })
  };

  private formatDate(date: Date): string {
    const year = date.getFullYear().toString()
    console.log((date.getMonth() + 1).toString())
    const month = (date.getMonth() + 1).toString().length == 1 ? '0'+(date.getMonth() + 1).toString() : (date.getMonth() + 1).toString()
    const day = date.getDate().toString().length == 1 ? '0'+date.getDate().toString() : date.getDate().toString()
    return `${year}-${month}-${day} 00:00`
  }

  cancel() {
    this.router.navigateByUrl('home/leaves')
  }
}
