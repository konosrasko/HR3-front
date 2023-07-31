import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu.component';
import { AppRoutingModule } from 'src/app/app-routing.module';

@NgModule({
  declarations: [MenuComponent],
  imports: [CommonModule],

  exports: [
    MenuComponent,
    AppRoutingModule
  ]
})
export class MenuModule { }
