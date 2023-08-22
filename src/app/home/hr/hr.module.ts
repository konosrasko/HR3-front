import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {AllEmployeesComponent} from './all-employees/all-employees.component';
import {MatOptionModule} from "@angular/material/core";
import {AddEmployeeComponent} from "./add-employee/add-employee.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from "@angular/material/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatRadioModule} from "@angular/material/radio";
import {MatSelectModule} from "@angular/material/select";
import {MatIconModule} from '@angular/material/icon';
import {LeaveCategoryComponent} from './leave-category/leave-category.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {AddCategoryComponent} from './leave-category/add-category/add-category.component';
import {EditCategoryComponent} from './leave-category/edit-category/edit-category.component';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatTooltipModule} from "@angular/material/tooltip";
import {EditEmployeeComponent} from './all-employees/edit-employee/edit-employee.component';
import {MatCardModule} from "@angular/material/card";
import {MatPaginatorModule} from "@angular/material/paginator";

@NgModule({
  declarations: [AllEmployeesComponent,AddEmployeeComponent, LeaveCategoryComponent, AddCategoryComponent, EditCategoryComponent, EditEmployeeComponent],
    imports: [CommonModule, MatTableModule, MatSortModule, MatOptionModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatDatepickerModule, DatePipe, MatRadioModule, MatSelectModule, MatProgressSpinnerModule, MatIconModule, MatSlideToggleModule, MatCardModule, MatTooltipModule, MatPaginatorModule]
})
export class HrModule { }
