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

@NgModule({
  declarations: [
    HomeComponent,
    LandingComponent,
    MyDetailsComponent
  ],
  imports: [
    CommonModule,
    FooterModule,
    SidenavListModule,
    MenuModule,
    AppRoutingModule,
    FormsModule
  ],
})
export class HomeModule { }