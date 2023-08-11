import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {MatTableDataSource} from "@angular/material/table";
import {SubordinatesReq} from "../../models/subordinatesReq.model";
import {EmployeeService} from "../../services/employee.service";

@Component({
  selector: 'app-subordinates',
  templateUrl: './subordinates.component.html',
  styleUrls: ['./subordinates.component.scss']
})
export class SubordinatesComponent implements OnInit{

  constructor(private router:Router,private userService: UserService, private employeeService: EmployeeService) {
    if (this.token != null){
      this.userService.getAllSubordinatesReq().subscribe({
        next:data=>this.loadData(data),
        error: err=>{console.log();alert("Προβλημα")}
      })
    }else {
      alert("Πρέπει να συνδεθείς")
      this.router?.navigateByUrl('login');
    }
  }

  token:string | null = localStorage.getItem('token');
  subordinatesRequests?: SubordinatesReq[];
  selectedStatus: string = "all";

  status: string[]=["all", "accepted", "declined", "pending"];
  displayedColumns=['firstName' ,'lastName' ,'leaveTitle' ,'submitDate' ,'startDate' ,'endDate' ,'duration' ,'status','accept','decline'];
  dataSource?: any;
  ngOnInit(){
  }

  loadData(data: any){
    this.subordinatesRequests = JSON.parse(data);
    this.dataSource = new MatTableDataSource<SubordinatesReq>(this.subordinatesRequests);
    this.dataSource.filterPredicate = function (record:{ status: string }, filter:string){
    return record.status.toLocaleLowerCase() == filter.toLocaleLowerCase()
    }
  }

  getIndexClass(row: any): string {
    const index = this.dataSource.data.indexOf(row);
    return index % 2 === 0 ? 'even-row' : 'odd-row';
  }


  applyStatusFilter(filterValue: string) {

    if (filterValue === 'all') {
      this.dataSource.filter = '';
      return;
    }
    if (filterValue === 'approved') {
      this.dataSource.filter = 'APPROVED';
      return;
    }
    if (filterValue === 'denied') {
      this.dataSource.filter = 'DENIED';
      return;
    }
    if (filterValue === 'pending') {
      this.dataSource.filter = 'PENDING';
      return;
    }
    filterValue = filterValue.trim();
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      return data.status.includes(filter);
    };
    this.dataSource.filter = filterValue;
  }


  // getRowDataFromCell(cell: HTMLElement) {
  //   const row = cell.parentElement?.parentElement?.parentElement;
  //   if (row && row.parentElement?.parentElement) {
  //     const rowIndex = Array.from(row.parentElement?.children).indexOf(row) - 1;
  //     return this.dataSource.data[rowIndex];
  //   }else return undefined;
  // }

  toggleContentBasedOnString(status: string) {
    if (status === 'APPROVED') {
      return 'Εγκεκριμένη';  // Change this to the desired content for 'active' status
    } else if (status === 'DENIED') {
      return 'Απορριφθείσα';  // Change this to the desired content for 'inactive' status
    }else if (status === 'PENDING') {
      return 'Υποβληθείσα';  // Change this to the desired content for 'inactive' status
    }
    return ;
  }




  navigateTo(url:string ){
    this.router?.navigateByUrl('home/subordinates/' + url);
  }

  approveRequest(subordinateReq: SubordinatesReq) {
    if (subordinateReq.leaveId != null) {
      this.employeeService.approveLeaveRequest(subordinateReq.leaveId).subscribe(data => {
          this.userService.getAllSubordinatesReq().subscribe({
            next: data => this.loadData(data),
            error: err => {
              console.log();
              alert("Προβλημα")
            }
          })
      });
    }

  }

  declineRequest(subordinateReq: SubordinatesReq) {
    if (subordinateReq.leaveId != null) {
      this.employeeService.declineLeaveRequest(subordinateReq.leaveId).subscribe(data => {
          this.userService.getAllSubordinatesReq().subscribe({
            next: data => this.loadData(data),
            error: err => {
              console.log();
              alert("Προβλημα")
            }
          })
      });
    }
  }
}
