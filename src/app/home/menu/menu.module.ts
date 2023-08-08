import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { HomeModule } from '../home.module';
import {MatTooltipModule} from "@angular/material/tooltip";

@NgModule({
  declarations: [MenuComponent],
    imports:
        [CommonModule, MatTooltipModule],
  exports: [
    MenuComponent,
    AppRoutingModule,
  ]
})
export class MenuModule { }
