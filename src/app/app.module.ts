import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from "@angular/material/sidenav";
import { FormsModule } from "@angular/forms";
import { UserService} from "./services/user.service";
import { LoginModule } from './login/login.module';
import { HomeModule } from './home/home.module';
import { EmployeeComponent } from './employee/employee.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MatCardModule } from "@angular/material/card";
import {MatButtonModule} from '@angular/material/button';



@NgModule({
  declarations: [
    AppComponent,
    EmployeeComponent,
    PageNotFoundComponent

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
        // Add HomeModule here
    ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
