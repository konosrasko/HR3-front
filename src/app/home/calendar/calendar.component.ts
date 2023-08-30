import {Component, OnInit} from '@angular/core';
import {CalendarOptions} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import {LeaveRequestService} from "../../services/leave_request.service";
import {EmployeeService} from "../../services/employee.service";
import {UserService} from "../../services/user.service";
import {LeaveRequest} from "../../models/leave_request.model";
import {SubordinatesReq} from "../../models/subordinatesReq.model";

@Component({
  selector: 'app-root',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
  // styles : ['.fc-toolbar-title{background-color: pink!important;color:teal!important;}']
})
export class CalendarComponent implements OnInit {

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    weekends: true,
    events: [{
      title: 'My Event',
      start: '2010-01-01',
      url: 'http://localhost:4200/home/leaves/requests'
    }],
    eventBackgroundColor: 'rgb(0,0,0)',
    fixedWeekCount: false,
    eventColor: '#000000',
    eventClick: (info) => {
      if (info.event.url) {
        window.open(info.event.url);
      }
    },
    //εφαρμογή κλάσης στις άδειες των υφισταμένων
    eventDidMount: (info) => {
      if (info.event.extendedProps && info.event.extendedProps['subordinate']) {
        info.el.classList.add('subordinate-event');
      } else {
        info.el.classList.add('personal-event');
      }
    },
    //δεν χρησιμοποιείται προς το παρον
    eventMouseEnter: (info) => {
      info.el.classList.add('hovered');
    },
    eventMouseLeave: (info) => {
      info.el.classList.remove('hovered');
    },

    aspectRatio: 1,
    eventContent: this.customizeEventContent.bind(this),
    dayHeaderContent: this.translateDayHeader.bind(this),
  };

  finalList:any[]=[];
  myID?:number;
  employeeId?: number
  leaves: LeaveRequest[] = []
  personalLeaves: any[] = [];

  customizeEventContent(arg: any) {
    const eventElement = document.createElement('div');
    eventElement.classList.add('custom-event');
    eventElement.style.backgroundColor = 'darkorange';
    eventElement.style.fontSize = '16px';
    eventElement.style.padding = '3px';
    eventElement.style.borderRadius = '2px';
    eventElement.style.whiteSpace = "normal";
    eventElement.classList.add('custom-event');

    const eventLink = document.createElement('a');
    eventLink.href = `http://localhost:4200/home/leaves/edit?id=${arg.event.id}`;
    eventLink.style.textDecoration = 'none';
    eventLink.style.color = '#252525 ';


    const eventTitle = document.createElement('div');
    eventTitle.innerText = arg.event.title;
    eventElement.appendChild(eventTitle);

    eventLink.appendChild(eventTitle);
    eventElement.appendChild(eventLink);


    return { domNodes: [eventElement] };
  }


  constructor(private leaveRequestService: LeaveRequestService, private employeeService: EmployeeService, private userService: UserService) {
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
            title: (leave.leaveTitle || 'Leave'),
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
                  id: leave.leaveId !== undefined ? leave.leaveId.toString() : '',
                  title: (leave.leaveTitle || 'Leave') + ' ' + leave.firstName + ' ' + leave.lastName,
                  start: startDate,
                  end: endDate,
                  extendedProps: { subordinate: true } // Add this line to mark as subordinate event
                };
              });

            // Check for existing entries in personalLeaves before adding
            filteredSubordinatesLeaves.forEach(subordinateLeave => {
              const existingEntry = this.personalLeaves.find(
                entry => entry.id === subordinateLeave.id
              );
              subordinateLeave.end?.setDate(subordinateLeave.end?.getDate()+1)
              if (!existingEntry) {
                this.personalLeaves.push(subordinateLeave);
              }
            });

            // Update calendar events
            this.calendarOptions.events = this.personalLeaves;
          }
        });
      }
    });
  }
// Μετάφραση ονόματος ημερών
  translateDayHeader(arg: any) {
    const eventElement = document.createElement('div');
    eventElement.classList.add('day-header');
    switch (arg.dow) {
      case 1: eventElement.innerText = "Δευτέρα"; break;
      case 2: eventElement.innerText = "Τρίτη"; break;
      case 3: eventElement.innerText = "Τετάρτη"; break;
      case 4: eventElement.innerText = "Πέμπτη"; break;
      case 5: eventElement.innerText = "Παρασκευή"; break;
      case 6: eventElement.innerText = "Σάββατο"; break;
      case 0: eventElement.innerText = "Κυριακή"; break;
    }
    return { domNodes: [eventElement] };
  }
}
