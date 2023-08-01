import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule} from '@angular/material/table';
import { AddComponent } from './add/add.component';
import { RequestsComponent } from './requests/requests.component';
import { MatSortModule } from '@angular/material/sort';



@NgModule({
  declarations: [
    RequestsComponent,
    AddComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule
  ]
})
export class LeavesModule { }
