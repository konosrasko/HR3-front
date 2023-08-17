import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MenuModule} from "../menu/menu.module";
import {SidenavListModule} from "../sidenav-list/sidenav-list.module";
import {FooterModule} from "../footer/footer.module";

@NgModule({
  declarations: [

  ],
  imports: [
    MatToolbarModule,
    MatSidenavModule,
    CommonModule,
    MenuModule,
    SidenavListModule,
    FooterModule
    ]
})
export class MyDetailsModule { }
