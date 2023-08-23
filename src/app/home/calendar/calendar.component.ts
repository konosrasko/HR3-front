import {Component, OnInit} from '@angular/core';
import {CalendarOptions} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import {LeaveRequestService} from "../../services/leave_request.service";
import {EmployeeService} from "../../services/employee.service";
import {UserService} from "../../services/user.service";
import {LeaveRequest} from "../../models/leave_request.model";





@Component({
  selector: 'app-root',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
  // styles : ['.fc-toolbar-title{background-color: pink!important;color:teal!important;}']
})
export class CalendarComponent implements OnInit{

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    weekends: true,
    events:[{
      title: 'My Event',
      start: '2010-01-01',
      url: 'http://localhost:4200/home/leaves/requests'
    }],
    eventBackgroundColor:'rgb(0,0,0)',
    fixedWeekCount:false,
    eventColor: '#000000',
    eventClick: function (info) {
      if (info.event.url) {
        window.open(info.event.url);
      }
    },

    aspectRatio: 2.805,
    eventContent: this.customizeEventContent.bind(this)


  };


  employeeId?:number
  leaves:LeaveRequest[]=[]

  customizeEventContent(arg: any) {
    const eventElement = document.createElement('div');
    eventElement.classList.add('custom-event');
    eventElement.style.backgroundColor = 'darkorange'; // Change background color to orange
    eventElement.style.color = 'white'; // Set text color to white
    eventElement.style.fontSize = '16px'; // Increase font size
    eventElement.style.padding = '3px'; // Add padding for better visibility
    eventElement.style.borderRadius = '2px'; // Add rounded corners
    eventElement.classList.add('custom-event');


    const eventLink = document.createElement('a'); // Create a clickable link element
    eventLink.href = `http://localhost:4200/home/leaves/edit?id=${arg.event.id}` // Set the URL for the link
    eventLink.style.textDecoration = 'none'; // Remove underline

    const eventTitle = document.createElement('div');
    eventTitle.innerText = arg.event.title + ' (' + arg.event.start.toLocaleDateString() + ')';
    eventElement.appendChild(eventTitle);

    eventLink.appendChild(eventTitle);
    eventElement.appendChild(eventLink);

    return { domNodes: [eventElement] };
  }


  constructor(private leaveRequestService:LeaveRequestService,private employeeService:EmployeeService,private userService:UserService) {
  }
  ngOnInit(): void {

    this.getLeaves();


  }

  changes(){
    //const el = #('<main></main>');
  }


  getLeaves() {
    this.leaveRequestService.getCalendarLeaveRequests().subscribe(data => {
      this.leaves = data;

      this.calendarOptions.events = this.leaves
          .filter(leave => leave.status === 'APPROVED') // Filter accepted events
          .map(leave => {
            const startDate = leave.startDate ? new Date(leave.startDate) : undefined;
            const endDate = leave.endDate ? new Date(leave.endDate) : undefined;

            return {
              id: leave.id !== undefined ? leave.id.toString():'',
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
