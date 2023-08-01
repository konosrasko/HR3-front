import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from "@angular/material/sidenav";
import { FormsModule } from "@angular/forms";
import { UserService } from "./services/user.service";
import { LoginModule } from './login/login.module';
import { HomeModule } from './home/home.module';
import { EmployeeComponent } from './employee/employee.component';

@NgModule({
  declarations: [
    AppComponent,
    EmployeeComponent
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
    HomeModule // Add HomeModule here
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
