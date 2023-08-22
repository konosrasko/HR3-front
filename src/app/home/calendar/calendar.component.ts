import {Component, OnInit} from '@angular/core';
import {CalendarOptions} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import {LeaveRequestService} from "../../services/leave_request.service";
import {EmployeeService} from "../../services/employee.service";
import {UserService} from "../../services/user.service";
import {LeaveRequest} from "../../models/leave_request.model";
import {Observable} from "rxjs";


@Component({
  selector: 'app-root',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit{

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    events:[],
    eventContent: this.customizeEventContent.bind(this)
  };

  employeeId?:number
  leaves:LeaveRequest[]=[]

  customizeEventContent(arg: any) {
    const eventElement = document.createElement('div');
    eventElement.classList.add('custom-event');
    eventElement.style.backgroundColor = 'orange'; // Change background color to orange
    eventElement.style.color = 'white'; // Set text color to white
    eventElement.style.fontSize = '16px'; // Increase font size
    eventElement.style.padding = '5px'; // Add padding for better visibility
    eventElement.style.borderRadius = '5px'; // Add rounded corners

    const eventTitle = document.createElement('div');
    eventTitle.innerText = arg.event.title + ' (' + arg.event.start.toLocaleDateString() + ')';
    eventElement.appendChild(eventTitle);

    return { domNodes: [eventElement] };
  }


  constructor(private leaveRequestService:LeaveRequestService,private employeeService:EmployeeService,private userService:UserService) {
  }
  ngOnInit(): void {
    this.getLeaves();

  }

  getLeaves() {
    this.leaveRequestService.getCalendarLeaveRequests().subscribe(data => {
      this.leaves = data;

      // Populate the calendar events array
      this.calendarOptions.events = this.leaves.map(leave => {
        // Check if startDate and endDate are defined before creating Date objects
        const startDate = leave.startDate ? new Date(leave.startDate) : undefined;
        const endDate = leave.endDate ? new Date(leave.endDate) : undefined;

        return {
          title: leave.leaveTitle || 'Leave',
          start: startDate,
          end: endDate
        };
      });
    });
  }


  // getLeaveHistoryFromUser(employeeId: number): void {
  //   this.leaveRequestService.getCalendarLeaveRequests().subscribe(data => {
  //     this.calendarOptions.events = data
  //         .filter(leaveRequest => leaveRequest.id === employeeId)
  //         .map(leaveRequest => ({
  //           title: leaveRequest.leaveTitle || 'Leave',
  //           start: leaveRequest.startDate as string,
  //           end: leaveRequest.endDate as string
  //         }));
  //   });
  // }
}
