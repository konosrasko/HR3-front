import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { LeaveRequest } from 'src/app/models/leave_request.model';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent {

  constructor(private router:Router){}

  ELEMENT_DATA: LeaveRequest[] = [
    { submitDate: new Date, startDate: new Date, endDate: new Date, duration: 1, title: "Κανονική", status: "Εκκρεμεί"},
    { submitDate: new Date, startDate: new Date, endDate: new Date, duration: 1, title: "Κανονική", status: "Εκκρεμεί"},
    { submitDate: new Date, startDate: new Date, endDate: new Date, duration: 1, title: "Κανονική", status: "Απορρίφθηκε"},
    { submitDate: new Date, startDate: new Date, endDate: new Date, duration: 1, title: "Κανονική", status: "Εκκρεμεί"},
    { submitDate: new Date, startDate: new Date, endDate: new Date, duration: 1, title: "Κανονική", status: "Εκκρεμεί"},
    { submitDate: new Date, startDate: new Date, endDate: new Date, duration: 1, title: "Κανονική", status: "Εγκεκριμένη"},
    { submitDate: new Date, startDate: new Date, endDate: new Date, duration: 1, title: "Κανονική", status: "Εγκεκριμένη"},
    { submitDate: new Date, startDate: new Date, endDate: new Date, duration: 1, title: "Κανονική", status: "Εγκεκριμένη"},
    { submitDate: new Date, startDate: new Date, endDate: new Date, duration: 1, title: "Κανονική", status: "Απορρίφθηκε"},
    { submitDate: new Date, startDate: new Date, endDate: new Date, duration: 1, title: "Κανονική", status: "Απορρίφθηκε"},
    { submitDate: new Date, startDate: new Date, endDate: new Date, duration: 1, title: "Κανονική", status: "Εγκεκριμένη"},
    { submitDate: new Date, startDate: new Date, endDate: new Date, duration: 1, title: "Κανονική", status: "Απορρίφθηκε"},
    { submitDate: new Date, startDate: new Date, endDate: new Date, duration: 1, title: "Κανονική", status: "Εγκεκριμένη"}
  ];

  displayedColumns = ['submitDate', 'startDate', 'endDate', 'duration', 'title', 'status', 'delete'];
  dataSource = new MatTableDataSource<LeaveRequest>(this.ELEMENT_DATA);

  @ViewChild(MatSort)sort: MatSort = new MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.sortLastColumn(); 
  }

  getIndexClass(row: any): string {
    const index = this.dataSource.data.indexOf(row);
    return index % 2 === 0 ? 'even-row' : 'odd-row';
  }

  getRowDataFromCell(cell: HTMLElement): LeaveRequest | undefined {
    const row = cell.parentElement;
    if (row && row.parentElement) {
      const rowIndex = Array.from(row.parentElement.children).indexOf(row);
      return this.dataSource.data[rowIndex];
    }
    return undefined;
  }

  deleteRequest(event: Event){
    const cell = event.target as HTMLElement;
    const rowData = this.getRowDataFromCell(cell);
    if (rowData) {
      // DELETE REQUEST
      console.log(rowData);
    }
  }

  sortLastColumn() {
    const lastColumnName = this.displayedColumns[this.displayedColumns.length - 2];
    const sortDirection: 'asc' | 'desc' = 'desc'; // Choose 'asc' or 'desc' as per your requirement
    this.sort.sort({ id: lastColumnName, start: sortDirection, disableClear: false });
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



