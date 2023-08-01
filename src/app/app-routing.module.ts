import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { MyDetailsComponent } from './home/my-details/my-details.component';
import { LandingComponent } from './home/landing/landing.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'home', component: HomeComponent, children: [
      { path: 'MyDetails', component: MyDetailsComponent },
      { path: 'landing', component: LandingComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }