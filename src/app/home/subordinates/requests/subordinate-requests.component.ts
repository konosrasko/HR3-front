import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { MatTableDataSource } from "@angular/material/table";
import { NgToastService } from 'ng-angular-popup';
import {HttpStatusCode} from "@angular/common/http";
import { SubordinatesReq } from 'src/app/models/subordinatesReq.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-subordinates',
  templateUrl: './subordinate-requests.component.html',
  styleUrls: ['./subordinate-requests.component.scss']
})
export class SubordinateRequestComponent implements OnInit {

  isLoaded: boolean = false;

  constructor(private router: Router, private userService: UserService, private employeeService: EmployeeService, private toast:NgToastService) {
    this.userService.getAllSubordinatesReq().subscribe({
      next: data => {
        this.loadData(data)
      },
      error: error => {
        if(error.status === HttpStatusCode.GatewayTimeout){
          this.toast.error({detail: 'Αποτυχία!', summary: "There was a gateway error", position: "topRight", duration: 4000});
        }
        console.log(error);
        // alert("Προβλημα");
      }
    })
  }

  subordinatesRequests?: SubordinatesReq[];
  selectedStatus: string = "all";

  status: string[] = ["all", "Εγκεκριμένη", "Απορρίφθηκε", "Εκκρεμεί"];
  displayedColumns = ['firstName', 'lastName', 'leaveTitle', 'submitDate', 'startDate', 'endDate', 'duration', 'status', 'accept', 'decline'];
  dataSource?: any;
  ngOnInit() {
  }

  loadData(data: any) {
    this.subordinatesRequests = JSON.parse(data);
    if(this.subordinatesRequests) this.subordinatesRequests = this.translated(this.subordinatesRequests)

    this.dataSource = new MatTableDataSource<SubordinatesReq>(this.subordinatesRequests);
    this.dataSource.filterPredicate = function (record: { firstName: string }, filter: string) {
      return record.firstName.toLocaleLowerCase() == filter.toLocaleLowerCase()
    }
    this.isLoaded = true;
  }

  approveRequest(subordinateReq: SubordinatesReq) {
    if (subordinateReq.leaveId != null) {
      this.employeeService.approveLeaveRequest(subordinateReq.leaveId).subscribe(data => {
        this.userService.getAllSubordinatesReq().subscribe({
          next: data => this.loadData(data),
          error: err => {
            console.log();
            alert("Προβλημα")
          }
        })
      });
    }
  }

  declineRequest(subordinateReq: SubordinatesReq) {
    if (subordinateReq.leaveId != null) {
      this.employeeService.declineLeaveRequest(subordinateReq.leaveId).subscribe(data => {
        this.userService.getAllSubordinatesReq().subscribe({
          next: data => this.loadData(data),
          error: err => {
            console.log();
            alert("Προβλημα")
          }
        })
      });
    }
  }

  /* FILTERING */
  toggleDirectSubordinates(){
    //TO-DO: make this work
    this.isLoaded =  !this.isLoaded;
  }

  applyStatusFilter(filterValue: string) {
    if (filterValue === 'all') {
      this.dataSource.filter = '';
      return;
    }

    filterValue = filterValue.trim();
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      return data.status.includes(filterValue);
    };

    this.dataSource.filter = filterValue;
  }


  /* HELPER FUNCTIONS */
  translated(subordinateReqs: SubordinatesReq[]): SubordinatesReq[] {
    subordinateReqs.forEach(sr => {
      switch (sr.status) {
        case 'PENDING':
          sr.status = "Εκκρεμεί"; return "";
        case 'APPROVED':
          sr.status = "Εγκεκριμένη"; return "";
        case 'DENIED':
          sr.status = "Απορρίφθηκε"; return "";
        default:
          return "";
      }
    });
    return subordinateReqs
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Εκκρεμεί':
        return 'pending';
      case 'Εγκεκριμένη':
        return 'accepted';
      case 'Απορρίφθηκε':
        return 'denied';
      default:
        return ''; // Add a default class or leave it empty if no class needed
    }
  }

  navigateTo(url: string) {
    this.router?.navigateByUrl('home/subordinates/' + url);
  }
}
