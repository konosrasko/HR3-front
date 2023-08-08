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

  @ViewChild(MatSort)sort: MatSort = new MatSort;

  constructor(private changeDetectorRef: ChangeDetectorRef, private leaveRequestService: LeaveRequestService, private router:Router) {}

  ngOnInit() {
    //pull leave requests from the database
    this.leaveRequestService.getLeaveRequestHistory().subscribe(data=>{
      this.dataSource = new MatTableDataSource<LeaveRequest>(data);
    })

    setTimeout(() => {
      this.dataSource.sort = this.sort;
      this.sortLastColumn();
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.dataSource.sort = this.sort;
      this.sortLastColumn();
      this.changeDetectorRef.detectChanges();
    });
  }

  getRowDataFromCell(cell: HTMLElement): LeaveRequest | undefined {
    const row = cell.parentElement;
    if (row && row.parentElement) {
      const rowIndex = Array.from(row.parentElement.children).indexOf(row);
      return this.dataSource.data[rowIndex];
    }
    return undefined;
  }

  editRequest(event: Event){
    const cell = event.target as HTMLElement;
    const rowData = this.getRowDataFromCell(cell);
    if (rowData) {
      //Open edit window with the selected leaveRequest as parameter
      this.router.navigate(['home/leaves/edit'], { queryParams: {id: rowData.id}});
    }
  }

  deleteRequest(event: Event){
    const cell = event.target as HTMLElement;
    const rowData = this.getRowDataFromCell(cell);
    if (rowData) {
      //Delete
      console.log(rowData);
    }
  }

  sortLastColumn() {
    const lastColumnName = this.displayedColumns[this.displayedColumns.length - 2];
    const sortDirection: 'asc' | 'desc' = 'asc'; // Choose 'asc' or 'desc' as per your requirement
    this.sort.sort({ id: lastColumnName, start: sortDirection, disableClear: false });
    console.log(this.sort)
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

  navigateTo(componentToOpen: String){
    this.router.navigateByUrl('home/leaves/' + componentToOpen);
  }


}



