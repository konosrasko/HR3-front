import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from '@angular/material/sort';
import {NgToastService} from 'ng-angular-popup';
import {HttpStatusCode} from "@angular/common/http";
import {SubordinatesReq} from 'src/app/models/subordinatesReq.model'
import {LeaveRequestService} from 'src/app/services/leave_request.service';
import {MatPaginator} from "@angular/material/paginator";
import {ModalService} from "../../../services/modal.service";

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
  hasData: Boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(public modalService: ModalService, private router: Router, private leaveRequestService: LeaveRequestService, private toast: NgToastService) { }

  ngOnInit() {
    this.selectedStatus = "Εκκρεμεί"
    this.reloadRequests()
  }

  reloadRequests() {
    if (!this.showIndirect) {
      this.leaveRequestService.getDirectSubordinatesReq().subscribe({
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
    } finally{
      if (this.subordinatesRequests) this.subordinatesRequests = this.translated(this.subordinatesRequests)
      this.dataSource = new MatTableDataSource<SubordinatesReq>(this.subordinatesRequests);
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = function (record: { firstName: string }, filter: string) {
        return record.firstName.toLocaleLowerCase() == filter.toLocaleLowerCase()
      }
      this.applyStatusFilter(this.selectedStatus)
      this.isLoaded = true;
      this.dataSource.sort = this.sort;
    }
  }

  approveRequest(subordinateReq: SubordinatesReq) {
      this.modalService.openModal().afterClosed().subscribe({
        next:res =>{
          if(res){
            if (subordinateReq.leaveId) {
              this.leaveRequestService.approveLeaveRequest(subordinateReq.leaveId).subscribe({
                next: data => {
                  this.toast.success({
                    detail: 'Επιτυχία!',
                    summary: 'Το αίτημα εγκρίθηκε',
                    position: "topRight",
                    duration: 4000
                  });
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
        }
      });
  }

  declineRequest(subordinateReq: SubordinatesReq) {
    this.modalService.openModal().afterClosed().subscribe({
      next:res =>{
        if(res){
          if (subordinateReq.leaveId) {
            this.leaveRequestService.declineLeaveRequest(subordinateReq.leaveId).subscribe({
              next: data => {
                this.toast.success({
                  detail: 'Επιτυχία!',
                  summary: 'Το αίτημα απορρίφθηκε',
                  position: "topRight",
                  duration: 4000
                });
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
      }
    });
  }

  /* FILTERING */
  toggleDirectSubordinates() {
    this.showIndirect = !this.showIndirect
    this.reloadRequests()
  }

  applyStatusFilter(filterValue: string) {
    if (filterValue === 'all') {
      this.dataSource.filter = '';
      this.hasData = (this.dataSource.filteredData.length > 0);
      return;
    }

    filterValue = filterValue.trim();
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      return data.status.includes(filterValue);
    };


    this.dataSource.filter = filterValue;
    this.hasData = (this.dataSource.filteredData.length > 0);
  }

  /* SORTING */
  sortLastColumn() {
    const lastColumnName = this.displayedColumns[3];
    const sortDirection: 'asc' | 'desc' = 'desc'; // Choose 'asc' or 'desc' as per your requirement
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

