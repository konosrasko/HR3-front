import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatHeaderRow, MatHeaderRowDef, MatTableModule} from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { AllEmployeesComponent } from './all-employees/all-employees.component';
import {MatOptionModule} from "@angular/material/core";



@NgModule({
  declarations: [AllEmployeesComponent],
    imports: [CommonModule, MatTableModule, MatSortModule, MatOptionModule]
})
export class HrModule {}
