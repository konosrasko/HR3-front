import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {Router} from '@angular/router';
import {NgToastService} from 'ng-angular-popup';
import {LeaveRequest} from 'src/app/models/leave_request.model';
import {LeaveRequestService} from 'src/app/services/leave_request.service';
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit{
  displayedColumns = ['submitDate', 'startDate', 'endDate', 'duration', 'leaveTitle', 'status', 'delete'];
  dataSource: MatTableDataSource<LeaveRequest> = new MatTableDataSource<LeaveRequest>()
  isLoaded:boolean = false;
  @ViewChild(MatSort) sort!: MatSort;
  hasData: Boolean = false;
  private selectedLeaveRequest: LeaveRequest = {}
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private leaveRequestService: LeaveRequestService, private router: Router, private toast: NgToastService) { }

  ngOnInit() {
    this.leaveRequestService.getLeaveRequestHistory().subscribe((data: LeaveRequest[]) => {
      data = this.translated(data)
      this.dataSource = new MatTableDataSource<LeaveRequest>(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.hasData = (this.dataSource.filteredData.length > 0);
      this.sortLastColumn();
      this.isLoaded = true;
    })
  }

  sortLastColumn() {
    const lastColumnName = this.displayedColumns[0];
    const sortDirection: 'asc' | 'desc' = 'desc'; // Choose 'asc' or 'desc' as per your requirement
    this.sort.sort({ id: lastColumnName, start: sortDirection, disableClear: false });
  }

  editRequest() {
    setTimeout(()=>{
      if (this.selectedLeaveRequest.id) {
        MatTableDataSource
        //Open edit window with the selected leaveRequest id as parameter
        this.router.navigate(['home/leaves/edit'], { queryParams: { id: this.selectedLeaveRequest.id } });
      }
    }, 100)
  }

  deleteRequest(event: Event) {
    setTimeout(() => {

      if (this.selectedLeaveRequest.id) {
        //deleting the leave request
        this.isLoaded = false;
        this.leaveRequestService.deleteLeaveRequest(this.selectedLeaveRequest.id).subscribe(data => {
          this.toast.success({detail: 'Επιτυχία!', summary: 'Το αίτημα διαγράφτηκε επιτυχώς', position: "topRight", duration: 4000});
          //successfull delete: refresh leave requests
          this.isLoaded = true;
          this.leaveRequestService.getLeaveRequestHistory().subscribe((data: LeaveRequest[]) => {
            data = this.translated(data)
            this.dataSource = new MatTableDataSource<LeaveRequest>(data);

            this.dataSource.sort = this.sort;
            this.sortLastColumn();
          })
        })
      }
    }, 200)
  }

  /* HELPER FUNCTIONS */
  /* ---------------  */

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

  translated(leaveRequests: LeaveRequest[]): LeaveRequest[] {
    leaveRequests.forEach(leaveRequest => {
      switch (leaveRequest.status) {
        case 'PENDING':
          leaveRequest.status = "Εκκρεμεί"; return "";
        case 'APPROVED':
          leaveRequest.status = "Εγκεκριμένη"; return "";
        case 'DENIED':
          leaveRequest.status = "Απορρίφθηκε"; return "";
        default:
          return "";
      }
    });
    return leaveRequests
  }

  navigateTo(componentToOpen: String) {
    this.router.navigateByUrl('home/leaves/' + componentToOpen);
  }

  setRow(row: LeaveRequest) {
    this.selectedLeaveRequest = row;
  }


}



