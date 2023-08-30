import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {LeaveBalance} from 'src/app/models/leave_balance.model';
import {LeaveRequest} from 'src/app/models/leave_request.model';
import {EmployeeService} from 'src/app/services/employee.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-rest-leaves',
  templateUrl: './rest-leaves.component.html',
  styleUrls: ['./rest-leaves.component.scss'],

})

export class RestLeavesComponent  implements OnInit{
  selected: string = '';
  displayedColumns = ['category', 'days', 'daysTaken'];
  dataSource = new MatTableDataSource<LeaveBalance>
  @ViewChild(MatSort)sort: MatSort = new MatSort;
  rowId?:number
  firstName:String = ''
  lastName:String = ''
  isLoaded: boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(private changeDetectorRef: ChangeDetectorRef, private employeeService:EmployeeService,
              private router:Router,private route:ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params=>{
     if (params["id"]) {
        this.rowId = params["id"];
        if(this.rowId!= null){
          this.employeeService.getLeaveBalancesOfAnotherEmployee(this.rowId).subscribe(data => {
            this.dataSource = new MatTableDataSource<LeaveRequest>(data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.sortLastColumn();
            this.isLoaded = true;
        })
          this.firstName = params['firstName']
          this.lastName = params['lastName']

          }}else {
       this.employeeService.getLeaveBalances().subscribe(data=>{
             this.dataSource = new MatTableDataSource<LeaveRequest>(data);
             this.dataSource.paginator = this.paginator;
             this.dataSource.sort = this.sort;
             this.sortLastColumn();
             this.isLoaded = true;
       })
     }
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

