import {Component, OnInit} from '@angular/core';
import {CalendarOptions} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import {LeaveRequestService} from "../../services/leave_request.service";
import {EmployeeService} from "../../services/employee.service";
import {UserService} from "../../services/user.service";
import {LeaveRequest} from "../../models/leave_request.model";
import {SubordinatesReq} from "../../models/subordinatesReq.model";
import { EventInput } from '@fullcalendar/core';


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

  finalList:any[]=[];
  myID?:number;
  employeeId?:number
  leaves:LeaveRequest[]=[]
  personalLeaves: any[] = [];

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
    eventTitle.innerText = arg.event.title ;
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

  getLeaves(): any {
    this.leaveRequestService.getCalendarLeaveRequests().subscribe(data => {
      this.leaves = data;

      this.personalLeaves.push(
        ...this.leaves
          .filter(leave => leave.status === 'APPROVED')
          .map(leave => {
            const startDate = leave.startDate ? new Date(leave.startDate) : undefined;
            const endDate = leave.endDate ? new Date(leave.endDate) : undefined;

            return {
              id: leave.id !== undefined ? leave.id.toString() : '',
              title: (leave.leaveTitle || 'Leave') +' '+ "ΠΡΟΣΩΠΙΚΗ ΑΔΕΙΑ",
              start: startDate,
              end: endDate
            };
          })
      );

      // After fetching leaves, call the method to get subordinate leaves
      this.getSubsLeaves();
    });
  }

  getSubsLeaves(): any {
    // Fetch subordinates' leaves
    this.leaveRequestService.getAllSubordinatesReq().subscribe({
      next: subordinatesData => {
        const subordinatesLeaves: SubordinatesReq[] = JSON.parse(subordinatesData.toString());

        // Fetch logged-in user's details
        this.userService.getEmployeeDetails().subscribe({
          next: userDetails => {
            this.myID = userDetails.employeeId;

            // Filter and map subordinates' leaves
            const filteredSubordinatesLeaves = subordinatesLeaves
              .filter(leave => leave.status === 'APPROVED' && this.myID !== leave.employeeId)
              .map(leave => {
                const startDate = leave.startDate ? new Date(leave.startDate) : undefined;
                const endDate = leave.endDate ? new Date(leave.endDate) : undefined;
                return {
                  firstName: leave.firstName,
                  lastName: leave.lastName,
                  id: leave.leaveId !== undefined ? leave.leaveId.toString() : '',
                  title:( leave.leaveTitle || 'Leave')+' ' +leave.firstName + ' ' + leave.lastName,
                  start: startDate,
                  end: endDate

                };
              });

            this.personalLeaves.push(...filteredSubordinatesLeaves);

            this.personalLeaves.forEach(leaves=>{
              if(!this.finalList.includes(leaves)){
                this.finalList.push(leaves)
              }
            })
            this.calendarOptions.events = this.finalList;
          }
        });
      }
    });
  }


}
