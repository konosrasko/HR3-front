import { Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LeaveBalance } from 'src/app/models/leave_balance.model';
import { LeaveRequest } from 'src/app/models/leave_request.model';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { ChangeDetectorRef } from '@angular/core';
import { EmployeeService } from 'src/app/services/employee.service';
import { Router } from '@angular/router';

 

@Component({
  selector: 'app-rest-leaves',
  templateUrl: './rest-leaves.component.html',
  styleUrls: ['./rest-leaves.component.scss']
})

export class RestLeavesComponent  {
  selected: string = '';
  displayedColumns = ['category', 'days', 'daysTaken'];
  dataSource = new MatTableDataSource<LeaveBalance>
  @ViewChild(MatSort)sort: MatSort = new MatSort;

  constructor(private changeDetectorRef: ChangeDetectorRef, private employeeService:EmployeeService, private router:Router) {}

  ngOnInit() {
    this.employeeService.getLeaveBalances().subscribe(data=>{
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
    const sortDirection: 'asc' | 'desc' = 'asc'; // Choose 'asc' or 'desc' as per your requirement
    this.sort.sort({ id: lastColumnName, start: sortDirection, disableClear: false });
  }

  navigateTo(componentToOpen: String){
    this.router.navigateByUrl('home/leaves/' + componentToOpen);
  }

  
}

