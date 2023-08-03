import { Component, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
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

  ELEMENT_DATA: LeaveRequest[] = [
    {id:1, submitDate: new Date, startDate: new Date, endDate: new Date, duration: 1, title: "Κανονική", status: "Εκκρεμεί"},
    {id:2, submitDate: new Date, startDate: new Date, endDate: new Date, duration: 1, title: "Κανονική", status: "Εκκρεμεί"},
    {id:3, submitDate: new Date, startDate: new Date, endDate: new Date, duration: 1, title: "Κανονική", status: "Απορρίφθηκε"},
    {id:4, submitDate: new Date, startDate: new Date, endDate: new Date, duration: 1, title: "Κανονική", status: "Εκκρεμεί"},
    {id:5, submitDate: new Date, startDate: new Date, endDate: new Date, duration: 1, title: "Κανονική", status: "Εκκρεμεί"},
    {id:6, submitDate: new Date, startDate: new Date, endDate: new Date, duration: 1, title: "Κανονική", status: "Εγκεκριμένη"},
    {id:7, submitDate: new Date, startDate: new Date, endDate: new Date, duration: 1, title: "Κανονική", status: "Εγκεκριμένη"},
    {id:8, submitDate: new Date, startDate: new Date, endDate: new Date, duration: 1, title: "Κανονική", status: "Εγκεκριμένη"},
    {id:9, submitDate: new Date, startDate: new Date, endDate: new Date, duration: 1, title: "Κανονική", status: "Απορρίφθηκε"},
    {id:10, submitDate: new Date, startDate: new Date, endDate: new Date, duration: 1, title: "Κανονική", status: "Απορρίφθηκε"},
    {id:11, submitDate: new Date, startDate: new Date, endDate: new Date, duration: 1, title: "Κανονική", status: "Εγκεκριμένη"},
    {id:12, submitDate: new Date, startDate: new Date, endDate: new Date, duration: 1, title: "Κανονική", status: "Απορρίφθηκε"},
    {id:13, submitDate: new Date, startDate: new Date, endDate: new Date, duration: 1, title: "Κανονική", status: "Εγκεκριμένη"}
  ];

  displayedColumns = ['submitDate', 'startDate', 'endDate', 'duration', 'title', 'status', 'delete'];
  dataSource = new MatTableDataSource<LeaveRequest>(this.ELEMENT_DATA);

  @ViewChild(MatSort)sort: MatSort = new MatSort;

  constructor(private changeDetectorRef: ChangeDetectorRef, private router:Router) {}

  ngOnInit() {
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



