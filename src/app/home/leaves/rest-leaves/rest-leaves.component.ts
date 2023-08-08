import { Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LeaveBalance } from 'src/app/models/leave_balance.model';
import { LeaveRequest } from 'src/app/models/leave_request.model';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { ChangeDetectorRef } from '@angular/core';

 

@Component({
  selector: 'app-rest-leaves',
  templateUrl: './rest-leaves.component.html',
  styleUrls: ['./rest-leaves.component.scss']
})

export class RestLeavesComponent  {
  selected: string = '';
  ELEMENT_DATA: LeaveBalance[] = [
    { id: 1, categoryTitle: "KANONIKH", days: 2, daysTaken:1 },
    { id: 1, categoryTitle: "telosPantwn", days: 10, daysTaken:5 },
    { id: 1, categoryTitle: "Fro-Dead", days: 7, daysTaken:1 },
    { id: 1, categoryTitle: "Bak-Dead", days: 0, daysTaken:0 }]
  displayedColumns = ['category', 'days', 'daysTaken'];
  dataSource = new MatTableDataSource<LeaveBalance>(this.ELEMENT_DATA);
  @ViewChild(MatSort)sort: MatSort = new MatSort;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

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

 

  getRowDataFromCell(cell: HTMLElement): LeaveBalance | undefined {
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
      console.log(rowData);
    }

  }
  sortLastColumn() {
    const lastColumnName = this.displayedColumns[this.displayedColumns.length - 2];
    const sortDirection: 'asc' | 'desc' = 'desc'; // Choose 'asc' or 'desc' as per your requirement
    this.sort.sort({ id: lastColumnName, start: sortDirection, disableClear: false });
  }

  
}

