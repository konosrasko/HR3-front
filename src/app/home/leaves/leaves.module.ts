import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {AddComponent} from './add/add.component';
import {RequestsComponent} from './requests/requests.component';
import {MatSortModule} from '@angular/material/sort';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material/core';
import {RestLeavesComponent} from './rest-leaves/rest-leaves.component';
import {EditComponent} from './edit/edit.component';
import {MatButtonModule} from "@angular/material/button"; // Correct the import statement for RestLeavesComponent
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {NgToastModule} from 'ng-angular-popup';
import {MatPaginatorModule} from "@angular/material/paginator";

@NgModule({
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'gr-GR' }],
  declarations: [
    RequestsComponent,
    AddComponent,
    RestLeavesComponent,
    EditComponent
    ],
  imports: [
    // RestLeavesModule,
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    NgToastModule,
    MatNativeDateModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatPaginatorModule,
  ]
})
export class LeavesModule { }
