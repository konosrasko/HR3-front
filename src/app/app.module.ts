import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';
import { MenuComponent } from './home/menu/menu.component';
import { FooterComponent } from './home/footer/footer.component';
import { SidenavListComponent } from './home/sidenav-list/sidenav-list.component';


import { MatToolbarModule } from '@angular/material/toolbar';
import {MatSidenavModule} from "@angular/material/sidenav";
import {ReactiveFormsModule} from "@angular/forms";

import {FormsModule} from "@angular/forms";
import { EmployeeComponent } from './employee/employee.component';
import {UserService} from "./services/user.service";
import { LoginModule } from './login/login.module'; 
import { HomeComponent } from './home/home.component';
import { HomeModule } from './home/home.module';
import { MyDetailsComponent } from './home/my-details/my-details.component';




@NgModule({
  declarations: [
    AppComponent,
    EmployeeComponent,
    
  ],
    imports: [
        BrowserModule,
        LoginModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatToolbarModule,
        MatSidenavModule,
        FormsModule
      
    ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
