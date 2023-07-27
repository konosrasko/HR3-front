import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';
import { MenuComponent } from './menu/menu.component';
import { FooterComponent } from './footer/footer.component';
import { SidenavListComponent } from './sidenav-list/sidenav-list.component';
import { SidenavItemComponent } from './sidenav-list/sidenav-item/sidenav-item.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { ProfileComponent } from './profile/profile.component';

import {FormsModule} from "@angular/forms";
import { EmployeeComponent } from './employee/employee.component';
import {EmployeeService} from "./services/employee.service";
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    ProfileComponent,
    FooterComponent,
    SidenavListComponent,
    SidenavItemComponent,
    EmployeeComponent,
    LoginComponent,

  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatToolbarModule,
        FormsModule,
    ],
  providers: [EmployeeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
