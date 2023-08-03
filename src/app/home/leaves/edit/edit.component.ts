import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { LeaveRequest } from 'src/app/models/leave_request.model';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  providers: [DatePipe]
})
export class EditComponent {

  categoryControl = new FormControl('', [Validators.required]);
  categories = [
    { name: 'Κανονική' },
    { name: 'Αιμοδοσίας' },
    { name: 'Τέκνου' }
  ];

  leaveRequest: LeaveRequest = new LeaveRequest()

  leaveRequestFormGroup: FormGroup = new FormGroup({
    title: this.categoryControl,
    duration: new FormControl(''),
    submitDate: new FormControl(''),
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required])
  })

  today = new Date();
  @ViewChild('endDatePicker') endDatePicker!: MatDatepicker<Date>;


  constructor(private router: Router, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      const passedId = params["id"];
      if (passedId) {
        this.leaveRequest = this.retrieveLeaveRequest(passedId)
        console.log(this.leaveRequest)
        this.leaveRequestFormGroup.get('startDate')?.setValue(this.leaveRequest.startDate)
        this.leaveRequestFormGroup.get('endDate')?.setValue(this.leaveRequest.endDate)
        this.leaveRequestFormGroup.get('submitDate')?.setValue(this.leaveRequest.submitDate)
        this.leaveRequestFormGroup.get('duration')?.setValue(this.leaveRequest.duration)
        this.leaveRequestFormGroup.get('title')?.setValue(this.leaveRequest.title)
      }
      console.log(params);
      // Now you can use rowData as an object in your component as needed
    });

    this.leaveRequestFormGroup.get('startDate')?.setValidators([Validators.required]);
    this.leaveRequestFormGroup.get('startDate')?.setValidators([this.validateStartDate()]);
    this.leaveRequestFormGroup.get('startDate')?.updateValueAndValidity();
    this.leaveRequestFormGroup.get('endDate')?.disable();
    this.leaveRequestFormGroup.get('duration')?.disable();
    this.leaveRequestFormGroup.get('submitDate')?.disable();
    this.leaveRequestFormGroup.get('submitDate')?.setValue(new Date)

    //prosorino
    this.leaveRequestFormGroup.get('startDate')?.disable()
    this.leaveRequestFormGroup.get('submitDate') ?.disable()
    this.leaveRequestFormGroup.get('title')?.disable()

    this.leaveRequestFormGroup.get('startDate')?.valueChanges.subscribe((value) => {

        console.log("start date changed")
        const startDate = value ? new Date(value) : null;

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

  private retrieveLeaveRequest(id: number): LeaveRequest {
    return { id: 1, startDate: new Date, endDate: new Date(), submitDate: new Date, duration: 1, status: "Εκκρεμεί", title: "Αιμοδοσίας" }
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
    console.log(this.leaveRequestFormGroup.get('title')?.value)
    console.log(this.leaveRequestFormGroup.get('startDate')?.value)
    console.log(this.leaveRequestFormGroup.get('endDate')?.value)
    console.log(this.leaveRequestFormGroup.get('submitDate')?.value)
    console.log(this.leaveRequestFormGroup.get('duration')?.value)
  }

  cancel() {
    this.router.navigateByUrl('home/leaves')
  }
}
