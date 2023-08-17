import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MenuComponent} from './menu.component';
import {AppRoutingModule} from 'src/app/app-routing.module';
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [MenuComponent],
    imports:
        [CommonModule, MatTooltipModule, MatIconModule,],
  exports: [
    MenuComponent,
    AppRoutingModule,

  ]
})
export class MenuModule { }
