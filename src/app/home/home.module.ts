import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { FooterModule } from './footer/footer.module';
import { SidenavListModule } from './sidenav-list/sidenav-list.module';
import { MenuModule } from './menu/menu.module';
import { LandingComponent } from './landing/landing.component';
import { AppRoutingModule } from '../app-routing.module';


@NgModule({
  declarations: [
    HomeComponent,
    LandingComponent
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
