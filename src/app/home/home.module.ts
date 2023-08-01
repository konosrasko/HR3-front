import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { FooterModule } from './footer/footer.module';
import { SidenavListModule } from './sidenav-list/sidenav-list.module';
import { MenuModule } from './menu/menu.module';
import { LandingComponent } from './landing/landing.component';
import { AppRoutingModule } from '../app-routing.module';
import { MyDetailsComponent } from './my-details/my-details.component';
import { FormsModule } from '@angular/forms';
import { LeavesComponent } from './leaves/leaves.component';
// import { RequestsComponent } from './leaves/requests/requests.component';
// import { AddComponent } from './leaves/add/add.component';
import { AdminComponent} from "./admin/admin.component";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatButtonModule} from "@angular/material/button";
import { LeavesModule } from './leaves/leaves.module';


@NgModule({
  declarations: [
    HomeComponent,
    LandingComponent,
    MyDetailsComponent,
    LeavesComponent,
    // RequestsComponent,
    // AddComponent,
    AdminComponent
  ],
  imports: [
    CommonModule,
    FooterModule,
    SidenavListModule,
    MenuModule,
    AppRoutingModule,
    LeavesModule,
    FormsModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule
  ],
})
export class HomeModule { }
