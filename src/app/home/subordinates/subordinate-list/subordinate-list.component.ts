import {Component} from '@angular/core';
import {Employee} from "../../../models/employee.model";
import {MatTableDataSource} from "@angular/material/table";
import {Subscription} from "rxjs";
import {EmployeeService} from "../../../services/employee.service";
import {HttpClient, HttpStatusCode} from "@angular/common/http";
import {Router} from "@angular/router";
import {NgToastService} from "ng-angular-popup";

@Component({
  selector: 'app-requests',
  templateUrl: './subordinate-list.component.html',
  styleUrls: ['./subordinate-list.component.scss']
})
export class SubordinateListComponent {
  employees?: Employee[];
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'mobileNumber', 'address', 'hireDate', 'enabled', 'supervisorLastName'];
  token: string | null = localStorage.getItem('token');
  dataSource?: any
  private subscription: Subscription | undefined;
  showContent?: string;
  isLoaded: boolean = false;
  showIndirect: boolean = false;
  selectedFirstName: string = "";
  rowData?: any;
  cell?:any;
  private selectedEmployeeId?: number | undefined;


  constructor(private employeeService: EmployeeService, private http: HttpClient, private toast: NgToastService, private router: Router) {
    this.reloadList()
  }

  reloadList(){
    if(this.showIndirect){

      this.employeeService.getAllSubordinates().subscribe({
        next: data => {
          this.loadEmployees(data)
        },
        error: error => {
          if (error.status === HttpStatusCode.GatewayTimeout) {
            this.toast.error({
            detail: 'Αποτυχία!',
            summary: "There was a gateway error",
            position: "topRight",
            duration: 4000
          });
          }
        }
      })
    }
    else {
      this.employeeService.getDirectSubordinates().subscribe({
        next: data => {
          this.loadEmployees(data)
        },
        error: error => {
          if(error.status === HttpStatusCode.GatewayTimeout){
            this.toast.error({detail: 'Αποτυχία!', summary: "There was a gateway error", position: "topRight", duration: 4000});
          }
        }
      })
    }
  }

  loadEmployees(data: any) {
    this.employees = JSON.parse(data);
    this.dataSource = new MatTableDataSource<Employee>(this.employees);
    this.dataSource.filterPredicate = function (record: { firstName: string }) {
      return record.firstName.toLocaleLowerCase();
    }
    this.isLoaded = true;
  }

  getIndexClass(row: any): string {
    const index = this.dataSource.data.indexOf(row);
    return index % 2 === 0 ? 'even-row' : 'odd-row';
  }

  toggleDirectSubordinates() {
    this.showIndirect = !this.showIndirect;
    this.reloadList()
  }

  toggleContentEnabled(status: boolean) {
    return this.showContent = status ? "Ενεργός" : "Ανενεργός";
  }

  onFirstNameChange($event: Event) {
    const filterValue = ($event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.selectedFirstName = filterValue.trim().toLowerCase();
    this.applyFilter();
  }

  applyFilter() {
    const userFilterValue = this.selectedFirstName;
    this.dataSource.filterPredicate = (data: any) => {
      const userMatch = data.firstName.toLowerCase().includes(userFilterValue);
      return userMatch;
    };
    this.dataSource.filter = `${userFilterValue}`;

  }
  getRow(employee : Employee,event:Event){
    this.selectedEmployeeId = employee.employeeId;
    this.changeColorOfSelectedRow(event)
  }

  changeColorOfSelectedRow(event:Event)// tha prepei na to balw ayto
  {

    const cell = event.target as HTMLElement;
    const selectedRow = cell.parentElement
    const matRows = document.querySelectorAll('.header-row');
    if(selectedRow!=null)
    {
      matRows.forEach(row=>
        row.classList.remove('selected'))
      selectedRow.classList.remove(`selected`)
      selectedRow.classList.add('selected') // go to css of this component to change the color
    }

  }



  editSubordinateProfile(event: Event){
    if (this.selectedEmployeeId) {
      this.router?.navigate(['home/subordinates/subordinate-profile'], { queryParams: {employee: this.selectedEmployeeId}});
    }
  }


  navigateTo(url:string ){
    this.router?.navigateByUrl('home/subordinates/' + url);
  }

  private getRowDataFromCell(cell: HTMLElement) {
    const row = cell.parentElement;
    if (row && row.parentElement) {
      const rowIndex = Array.from(row.parentElement.children).indexOf(row);
      return this.dataSource.data[rowIndex - 1];
      console.log("perasame")
    }
    return undefined;
  }


  showLeaveBalances(event: Event) {
    const cell = event.target as HTMLElement;
    console.log(cell)

    const rowData = this.getRowDataFromCell(cell);
    console.log(rowData)
    if (rowData) {
      //Open edit window with the selected leaveRequest as parameter
      this.router.navigate(['home/leaves/restLeaves'], {
        queryParams: {
         id: rowData.employeeId,
         firstName:rowData.firstName,
         lastName:rowData.lastName
        }
      });
    }
  }

  protected readonly onclick = onclick;
}

