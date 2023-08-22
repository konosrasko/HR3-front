import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Employee} from '../../../models/employee.model';
import {EmployeeService} from '../../../services/employee.service';
import {Subscription} from 'rxjs';
import {Router} from "@angular/router";
import {MatPaginator} from "@angular/material/paginator";
import {NgToastService} from "ng-angular-popup";

@Component({
  selector: 'app-all-employees',
  templateUrl: './all-employees.component.html',
  styleUrls: ['./all-employees.component.scss'],
})
export class AllEmployeesComponent implements OnInit, OnDestroy {
  employees: Employee[] = [];
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'mobileNumber', 'address', 'hireDate', 'enabled', 'supervisorLastName','edit-field'];
  dataSource?:any;
  private subscription: Subscription | undefined;
  private selectedEmployee?: Employee;
  showContent?: string;
  supervisorLastName:string = "";
  selectedStatus = 'all';
  selectedName = '';
  selectedLastName = '';
  isDataLoaded:boolean = false;

  constructor(private employeeService: EmployeeService, private router:Router,private toast:NgToastService) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
      this.subscription = this.employeeService.getAllEmployees().subscribe({
        next: (data) => {
          this.loadEmployees(data);
          this.isDataLoaded = true;
        },
        error: (error) => {
          this.toast.error({detail: 'Αποτυχία!', summary: 'Υπήρξε πρόβλημα στην επικοινωνία με τον server!', position: "topRight", duration: 3000});
        }
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadEmployees(data: any) {
    this.employees = JSON.parse(data);
    this.dataSource = new MatTableDataSource<Employee>(this.employees);
    this.dataSource.paginator = this.paginator;
  }

  onChangeStatus(){
    const filterValue = this.selectedStatus;

    if(filterValue === 'all') {
      this.dataSource.filterPredicate = function(data: { enabled: any; }, filter: any): boolean {
        return String(data.enabled).includes('true') || String(data.enabled).includes('false');
      };
    }else if(filterValue === 'enabled'){
        this.dataSource.filterPredicate = function(data: { enabled: any; }, filter: any): boolean {
            return String(data.enabled).includes('true');
        };
    }else if(filterValue === 'disabled') {
        this.dataSource.filterPredicate = function (data: { enabled: any; }, filter: any): boolean {
            return String(data.enabled).includes('false');
        };
    }
      this.applyFilter();
  }

  onFirstNameChange($event: Event){
    const filterValue = ($event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.selectedName = filterValue.trim().toLowerCase();
    this.applyFilter();
  }

  onLastNameChange($event: Event){
    const filterValue = ($event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.selectedLastName = filterValue.trim().toLowerCase();
    this.applyFilter();
  }

  applyFilter(){
      const statusFilterValue = this.selectedStatus;
      const firstNameValue = this.selectedName;
      const lastNameValue = this.selectedLastName;

      this.dataSource.filterPredicate = (data: any, filter: string) => {
        const statusMatch = statusFilterValue === 'all' ||
          (statusFilterValue === 'enabled' && String(data.enabled).includes('true')) ||
          (statusFilterValue === 'disabled' && String(data.enabled).includes('false'));

        const firstNameMatch = data.firstName.toLowerCase().includes(firstNameValue);

        const lastNameMatch = data.lastName.toLowerCase().includes(lastNameValue);

        return statusMatch && firstNameMatch && lastNameMatch;
      };

      this.dataSource.filter = `${statusFilterValue}${firstNameValue}${lastNameValue}`;
  }

  getIndexClass(row: any): string {
    const index = this.dataSource.data.indexOf(row);
    return index % 2 === 0 ? 'even-row' : 'odd-row';
  }

  navigateTo(componentToOpen: String){
    this.router?.navigateByUrl('home/hr/' + componentToOpen);
  }

  editRequest(event: Event){
    const cell = event.target as HTMLElement;
    const rowData = this.getRowDataFromCell(cell);
    if (rowData) {
      //Open edit window with the selected leaveRequest as parameter
      this.router?.navigate(['home/leaves/add'],{ queryParams: {id: rowData.employeeId, firstName: rowData.firstName, lastName: rowData.lastName}});
    }
  }

  private getRowDataFromCell(cell: HTMLElement) {
    const row = cell.parentElement;
    if (row && row.parentElement) {
      const rowIndex = Array.from(row.parentElement.children).indexOf(row);
      return this.dataSource.data[rowIndex - 1];
    }
    return undefined;
  }

  toggleContentEnabled(status: boolean) {
    return this.showContent = status ? "Ενεργός" : "Ανενεργός";
  }

  editEmployee() {
    if (this.selectedEmployee?.employeeId) {
      console.log(this.selectedEmployee.employeeId)
      //Open edit window with the selected leaveRequest id as parameter
      this.router?.navigate(['home/hr/edit-employee'], { queryParams: { employee: this.selectedEmployee.employeeId,supervisorLastName: this.selectedEmployee.supervisorLastName } });
    }
  }

  getRow(row: Employee) {
    this.selectedEmployee=row;
  }
}

