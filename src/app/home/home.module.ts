import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage, DatePipe} from '@angular/common';
import { HomeComponent } from './home.component';
import { FooterModule } from './footer/footer.module';
import { SidenavListModule } from './sidenav-list/sidenav-list.module';
import { MenuModule } from './menu/menu.module';
import { LandingComponent } from './landing/landing.component';
import { MyDetailsComponent } from './my-details/my-details.component';
import { AppRoutingModule } from '../app-routing.module';
import { MatTableModule } from '@angular/material/table';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { LeavesComponent } from './leaves/leaves.component';
import { AdminComponent } from "./admin/admin.component";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatButtonModule } from "@angular/material/button";
import { LeavesModule } from './leaves/leaves.module';
import { MatSortModule } from "@angular/material/sort";
import { MatInputModule } from "@angular/material/input";
import {AdminModule} from "./admin/admin.module";
import { SubordinatesComponent } from './subordinates/subordinates.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatIconModule} from "@angular/material/icon";
import {MatRadioModule} from "@angular/material/radio";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {HRComponent} from "./hr/hr.component";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {NgToastModule} from "ng-angular-popup";
import {MatCardModule} from "@angular/material/card";
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
  declarations: [
    HomeComponent,
    LandingComponent,
    MyDetailsComponent,
    LeavesComponent,
    AdminComponent,
    HRComponent,
    AdminComponent,
    SubordinatesComponent,

  ],
  imports: [
    CommonModule,
    FooterModule,
    SidenavListModule,
    MenuModule,
    AppRoutingModule,
    MatTableModule,
    AppRoutingModule,
    LeavesModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatTooltipModule,
    MatSortModule,
    MatSelectModule,
    MatInputModule,
    AdminModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatIconModule,
    MatRadioModule,
    MatSlideToggleModule,
    NgOptimizedImage,
    MatProgressSpinnerModule,
    NgToastModule,
    MatCardModule
  ],
  providers: [
    DatePipe,
  ],
})
export class HomeModule { }
