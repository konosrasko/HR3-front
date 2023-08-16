import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from "@angular/material/sidenav";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { UserService} from "./services/user.service";
import { LoginModule } from './login/login.module';
import { HomeModule } from './home/home.module';
import { EmployeeComponent } from './employee/employee.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MatCardModule } from "@angular/material/card";
import {MatButtonModule} from '@angular/material/button';
import { HRComponent } from './home/hr/hr.component';
import { AllEmployeesComponent } from './home/hr/all-employees/all-employees.component';
import {MatSortModule} from "@angular/material/sort";
import {MatTableModule} from "@angular/material/table";
import {HrModule} from "./home/hr/hr.module";
import { AddLeaveRequestComponent } from './home/hr/add-leave-request/add-leave-request.component';
import { AddEmployeeComponent } from './home/hr/add-employee/add-employee.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {CommonModule} from "@angular/common";
import { NgToastModule } from 'ng-angular-popup';

@NgModule({
  declarations: [
    AppComponent,
    EmployeeComponent,
    PageNotFoundComponent,
    AddLeaveRequestComponent,

  ],

  imports: [
    BrowserModule,
    LoginModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatToolbarModule,
    MatSidenavModule,
    FormsModule,
    HomeModule,
    MatCardModule,
    MatButtonModule,
    MatSortModule,
    MatTableModule,
    HrModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    NgToastModule
    // Add HomeModule here
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
