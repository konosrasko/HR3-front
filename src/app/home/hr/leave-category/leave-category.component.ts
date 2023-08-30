import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {LeaveCategoryService} from "../../../services/leave-category.service";
import {LeaveCategory} from "../../../models/leave-category.model";
import {NgToastService} from "ng-angular-popup";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-leave-category',
  templateUrl: './leave-category.component.html',
  styleUrls: ['./leave-category.component.scss']
})
export class LeaveCategoryComponent implements OnInit{
  status:string[] = ["all", "enabled", "disabled"];
  categories?: LeaveCategory[];
  displayedColumns: string[] = ['categoryName', 'status', 'editBtn'];
  selectedStatus: string = "all";
  selectedTitle: string = "";
  categoriesSource: any;
  showContent?: string;
  isLoaded: boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private categoryService: LeaveCategoryService, private router: Router, private toast: NgToastService) {
  }

  ngOnInit() {
    this.categoryService.getAllLeaveCategories().subscribe({
      next: data => {
        this.loadCategories(data);
      },
      error: err => {
        this.toast.error({detail: 'Αποτυχία!', summary: 'Δεν έχεις δικαιώματα HR ή υπήρξε πρόβλημα στην επικοινωνία με τον server!', position: "topRight", duration: 3000});
        this.router?.navigateByUrl('home/landing');
      }
    })
  }

  loadCategories(data: any){
    this!.categories = JSON.parse(data);
    if(this.categories!.length <= 0){
      this.navigateTo('add-category');
      this.toast.warning({detail: 'Δεν βρέθηκαν κατηγορίες αδειών!', summary: 'Προσθέστε τουλάχιστον μία κατηγορία άδειας', position: "topRight", duration: 5000})
    }
    this.categoriesSource = new MatTableDataSource<LeaveCategory>(this.categories);
    this.categoriesSource.paginator = this.paginator;
    this.isLoaded = true;
  }

  getIndexClass(row: any): string {
    const index = this.categoriesSource.data.indexOf(row);
    return index % 2 === 0 ? 'even-row' : 'odd-row';
  }

  toggleContentEnabled(status: boolean) {
    return this.showContent = status ? "Ενεργή" : "Ανενεργή";
  }

  getRowDataFromCell(cell: HTMLElement) {
    const row = cell.parentElement;
    if (row && row.parentElement?.parentElement) {
      const rowIndex = Array.from(row.parentElement?.children).indexOf(row) - 1;
      return this.categoriesSource.data[rowIndex];
    }else return undefined;
  }

  editCategory(event: Event){
    const cell = event.target as HTMLElement;
    const parentCell = cell.parentElement;
    if(parentCell !== null){
      const rowData = this.getRowDataFromCell(parentCell);
      if (rowData) {
        this.router?.navigate(['home/hr/leave-categories/edit-category'], { queryParams: {id: rowData.id}});
      }
    }
  }

  onChangeStatus(){
    const filterValue = this.selectedStatus;
    if(filterValue === 'all') {
      this.categoriesSource.filterPredicate = function(data: { active: any; }, filter: any): boolean {
        return String(data.active).includes('true') || String(data.active).includes('false');
      };
    }
    else if(filterValue === 'enabled'){
      this.categoriesSource.filterPredicate = function(data: { active: any; }, filter: any): boolean {
        return String(data.active).includes('true');
      };
    }else if(filterValue === 'disabled') {
      this.categoriesSource.filterPredicate = function (data: { active: any; }, filter: any): boolean {
        return String(data.active).includes('false');
      };
    }
    this.applyFilter();
  }

  onTitleChange($event: Event){
    const filterValue = ($event.target as HTMLInputElement).value;
    this.categoriesSource.filter = filterValue.trim().toLowerCase();
    this.selectedTitle = filterValue.trim().toLowerCase();
    this.applyFilter();
  }

  applyFilter(){
    const statusFilterValue = this.selectedStatus;
    const titleFilterValue = this.selectedTitle;

    this.categoriesSource.filterPredicate = (data: any, filter: string) => {
      const statusMatch =
        statusFilterValue === 'all' ||
        (statusFilterValue === 'enabled' && String(data.active).includes('true')) ||
        (statusFilterValue === 'disabled' && String(data.active).includes('false'));

      const titleMatch = data.title.toLowerCase().includes(titleFilterValue);

      return statusMatch && titleMatch;
    };

    this.categoriesSource.filter = `${statusFilterValue}${titleFilterValue}`;
  }

  navigateTo(url:string ){
    this.router?.navigateByUrl('home/hr/leave-categories/' + url);
  }
}
