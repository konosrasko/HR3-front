import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SidenavItemComponent} from '../sidenav-list/sidenav-item/sidenav-item.component'
import {SidenavListComponent} from './sidenav-list.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';


@NgModule({
  declarations: [SidenavItemComponent, SidenavListComponent],
  imports: [CommonModule,
    MatSidenavModule,
    MatToolbarModule],
  exports: [SidenavListComponent],
})
export class SidenavListModule { }
