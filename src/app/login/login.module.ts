import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login.component';
import {FormsModule} from '@angular/forms';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {HomeModule} from '../home/home.module';
import {FooterModule} from '../home/footer/footer.module';
import {NgToastModule} from 'ng-angular-popup';

const routes: Routes = [
  { path: '', component: LoginComponent }
];

@NgModule({
  declarations: [LoginComponent],
  imports: [
    MatIconModule,
    MatToolbarModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    HomeModule,
    FooterModule,
    NgToastModule,
  ],
  exports:[LoginComponent],
})

export class LoginModule { }
