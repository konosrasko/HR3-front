import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { FooterModule } from './footer/footer.module';
import { SidenavListModule } from './sidenav-list/sidenav-list.module';
import { MenuModule } from './menu/menu.module';
import { LandingComponent } from './landing/landing.component';
import { MyDetailsComponent } from './my-details/my-details.component'; 
import { AppRoutingModule } from '../app-routing.module';
import { LeavesComponent } from './leaves/leaves.component';
import { RequestsComponent } from './leaves/requests/requests.component';
import { AddComponent } from './leaves/add/add.component';


@NgModule({
  declarations: [
    HomeComponent,
    LandingComponent,
    MyDetailsComponent,
    LeavesComponent,
    RequestsComponent,
    AddComponent
  ],
  imports: [
    CommonModule,
    FooterModule,
    SidenavListModule,
    MenuModule,
    AppRoutingModule
  ],
})
export class HomeModule { }
