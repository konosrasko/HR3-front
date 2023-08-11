import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { AllEmployeesComponent } from './all-employees/all-employees.component';
import { MatOptionModule } from "@angular/material/core";
import { AddEmployeeComponent } from "./add-employee/add-employee.component";
import { MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from "@angular/material/button";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDatepicker, MatDatepickerModule } from "@angular/material/datepicker";
import { DatePipe } from "@angular/common";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [AllEmployeesComponent, AddEmployeeComponent],
  imports: [CommonModule, MatTableModule, MatSortModule, MatOptionModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatDatepickerModule, DatePipe, MatRadioModule, MatSelectModule, MatIconModule,]
})
export class HrModule { }
