import { Component, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { LeaveRequest } from 'src/app/models/leave_request.model';
import { LeaveRequestService } from 'src/app/services/leave_request.service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent {


  displayedColumns = ['submitDate', 'startDate', 'endDate', 'duration', 'leaveTitle', 'status', 'delete'];
  dataSource: MatTableDataSource<LeaveRequest> = new MatTableDataSource<LeaveRequest>()

  @ViewChild(MatSort) sort: MatSort = new MatSort;

  private selectedLeaveRequest: LeaveRequest = {}

  constructor(private changeDetectorRef: ChangeDetectorRef, private leaveRequestService: LeaveRequestService, private router: Router) { }



  ngOnInit() {
    //pull leave requests from the database
    this.leaveRequestService.getLeaveRequestHistory().subscribe((data: LeaveRequest[]) => {
      data = this.translated(data)
      this.dataSource = new MatTableDataSource<LeaveRequest>(data);

      this.dataSource.sort = this.sort;
      this.sortLastColumn();
    })
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.dataSource.sort = this.sort;
      this.sortLastColumn();
      this.changeDetectorRef.detectChanges();
    });
  }

  sortLastColumn() {
    const lastColumnName = this.displayedColumns[this.displayedColumns.length - 6];
    const sortDirection: 'asc' | 'desc' = 'asc'; // Choose 'asc' or 'desc' as per your requirement
    this.sort.sort({ id: lastColumnName, start: sortDirection, disableClear: false });
  }


  editRequest(event: Event) {
    const cell = event.target as HTMLElement;
    const rowData = this.getRowDataFromCell(cell);
    MatTableDataSource
    if (rowData) {
      //Open edit window with the selected leaveRequest as parameter
      this.router.navigate(['home/leaves/edit'], { queryParams: { id: rowData.id } });
    }
  }

  //called by edit request
  //returns leave request json
  getRowDataFromCell(cell: HTMLElement): LeaveRequest | undefined {
    const row = cell.parentElement;
    if (row && row.parentElement) {
      const rowIndex = Array.from(row.parentElement.children).indexOf(row);
      return this.dataSource.data[rowIndex];
    }
    return undefined;
  }

  deleteRequest(event: Event) {
    setTimeout(() => {

      if (this.selectedLeaveRequest.id) {
        //console.log(this.dataSource.find(row => row.id === rowData.id);)
        //deleting the leave request
        this.leaveRequestService.deleteLeaveRequest(this.selectedLeaveRequest.id).subscribe(data => {
          //successfull delete: refresh leave requests
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



