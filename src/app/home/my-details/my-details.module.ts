import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyDetailsComponent } from './my-details.component';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';



@NgModule({
  declarations: [MyDetailsComponent],
  imports: [
    MatToolbarModule,
    MatSidenavModule,
    CommonModule
  ]
})
export class MyDetailsModule { }
