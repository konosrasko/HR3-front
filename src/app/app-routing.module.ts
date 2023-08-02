import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { MyDetailsComponent } from './home/my-details/my-details.component';
import { LandingComponent } from './home/landing/landing.component';
import { RequestsComponent } from './home/leaves/requests/requests.component';
import { AddComponent } from './home/leaves/add/add.component';
import { RestLeavesComponent  } from './home/leaves/rest-leaves/rest-leaves.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'home', redirectTo: 'home/landing', pathMatch: 'full'},
  { path: 'home', component: HomeComponent,
    children:[
      { path: 'MyDetails', component: MyDetailsComponent},
      { path: 'landing', component: LandingComponent},
      { path: 'leaves', redirectTo: 'leaves/requests', pathMatch: 'full'},
      { path: 'leaves', children:[
          {path: 'requests', component: RequestsComponent},
          {path: 'add', component: AddComponent},
          {path: 'restLeaves', component: RestLeavesComponent  }
      ]},
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }