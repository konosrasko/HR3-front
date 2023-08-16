import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from '@angular/material/sort';
import { NgToastService } from 'ng-angular-popup';
import { HttpStatusCode } from "@angular/common/http";
import { SubordinatesReq } from 'src/app/models/subordinatesReq.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { UserService } from 'src/app/services/user.service';
import { LeaveRequestService } from 'src/app/services/leave_request.service';

@Component({
  selector: 'app-subordinates',
  templateUrl: './subordinate-requests.component.html',
  styleUrls: ['./subordinate-requests.component.scss']
})
export class SubordinateRequestComponent implements OnInit {

  isLoaded: boolean = false;
  showIndirect: boolean = false;
  @ViewChild(MatSort) sort: MatSort = new MatSort;
  subordinatesRequests?: SubordinatesReq[];
  selectedStatus: string = "all";
  status: string[] = ["all", "Εγκεκριμένη", "Απορρίφθηκε", "Εκκρεμεί"];
  displayedColumns = ['firstName', 'lastName', 'leaveTitle', 'submitDate', 'startDate', 'endDate', 'duration', 'status', 'accept', 'decline'];
  dataSource?: any;

  constructor(private changeDetectorRef: ChangeDetectorRef, private router: Router, private employeeService: EmployeeService, private leaveRequestService: LeaveRequestService, private toast: NgToastService) { }

  ngOnInit() {
    this.selectedStatus = "Εκκρεμεί"
    this.reloadRequests(this.sort)
  }

  reloadRequests(sort?:MatSort) {
    if (!this.showIndirect) {
      this.leaveRequestService.getDirectSubordinatesReq().subscribe({
        next: data => {
          this.loadData(data)
        },
        error: error => {
          console.log(error)
          this.toast.error({
            detail: 'Αποτυχία!',
            summary: error.status === HttpStatusCode.GatewayTimeout ? "Πρόβλημα σύνδεσης με τον διακομιστή" : error.error,
            position: "topRight", duration: 4000
          });
          this.isLoaded = true;
        }
      })
    } else {
      this.leaveRequestService.getAllSubordinatesReq().subscribe({
        next: data => {
          this.loadData(data)
        },
        error: error => {
          this.toast.error({
            detail: 'Αποτυχία!',
            summary: error.status === HttpStatusCode.GatewayTimeout ? "Πρόβλημα σύνδεσης με τον διακομιστή" : error.error,
            position: "topRight", duration: 4000
          });
          this.isLoaded = true;
        }
      })
    }
  }

  loadData(data: any) {
    try {
      this.subordinatesRequests = JSON.parse(data);
    } catch (error) {
      console.log("the requests have already been parsed.")
    } finally{
      if (this.subordinatesRequests) this.subordinatesRequests = this.translated(this.subordinatesRequests)
      console.log(this.subordinatesRequests);
    
      this.dataSource = new MatTableDataSource<SubordinatesReq>(this.subordinatesRequests);
      this.dataSource.filterPredicate = function (record: { firstName: string }, filter: string) {
        return record.firstName.toLocaleLowerCase() == filter.toLocaleLowerCase()
      }
      this.applyStatusFilter(this.selectedStatus)
      this.isLoaded = true;
    }
  }

  approveRequest(subordinateReq: SubordinatesReq) {
    
    if (subordinateReq.leaveId) {
      console.log(subordinateReq.leaveId)
      this.leaveRequestService.approveLeaveRequest(subordinateReq.leaveId).subscribe({
        next: data => {
          this.toast.success({ detail: 'Επιτυχία!', summary: 'Το αίτημα εγκρίθηκε', position: "topRight", duration: 4000 });
          this.reloadRequests()
        },
        error: error => {
          this.toast.error({
            detail: 'Αποτυχία!',
            summary: error.status === HttpStatusCode.GatewayTimeout ? "Πρόβλημα σύνδεσης με τον διακομιστή" : error.error,
            position: "topRight", duration: 4000
          });
          this.isLoaded = true;
        }
      });      
    }
  }

  declineRequest(subordinateReq: SubordinatesReq) {
    if (subordinateReq.leaveId != null) {
      this.leaveRequestService.declineLeaveRequest(subordinateReq.leaveId).subscribe({
        next: data => {
          this.toast.success({ detail: 'Επιτυχία!', summary: 'Το αίτημα απορρίφθηκε', position: "topRight", duration: 4000 });
          this.reloadRequests()
        },
        error: error => {
          this.toast.error({
            detail: 'Αποτυχία!',
            summary: error.status === HttpStatusCode.GatewayTimeout ? "Πρόβλημα σύνδεσης με τον διακομιστή" : error.error,
            position: "topRight", duration: 4000
          });
          this.isLoaded = true;
        }
      });
    }
  }

  /* FILTERING */
  toggleDirectSubordinates() {
    this.showIndirect = !this.showIndirect
    this.reloadRequests()
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

  /* SORTING */
  sortLastColumn() {
    const lastColumnName = this.displayedColumns[1];
    const sortDirection: 'asc' | 'desc' = 'asc'; // Choose 'asc' or 'desc' as per your requirement
    this.dataSource.sort.sort({ id: lastColumnName, start: sortDirection, disableClear: false });    
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

