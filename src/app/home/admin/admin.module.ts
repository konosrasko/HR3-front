import {NgModule} from '@angular/core';

import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MenuModule} from "../menu/menu.module";
import {SidenavListModule} from "../sidenav-list/sidenav-list.module";
import {FooterModule} from "../footer/footer.module";
import {MyDetailsModule} from "../my-details/my-details.module";
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatRadioModule} from '@angular/material/radio';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {AddUserComponent} from './add-user/add-user.component';
import {EditUserComponent} from './edit-user/edit-user.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {NgToastModule} from "ng-angular-popup";
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
  declarations: [
    AddUserComponent,
    EditUserComponent
  ],
  exports: [
    AddUserComponent
  ],
  imports: [
    MatToolbarModule,
    MatSidenavModule,
    CommonModule,
    MenuModule,
    SidenavListModule,
    FooterModule,
    MyDetailsModule,
    MatPaginatorModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatIconModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatSlideToggleModule,
    NgToastModule,
    MatProgressSpinnerModule
  ]
})
export class AdminModule { }
