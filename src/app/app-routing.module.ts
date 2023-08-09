import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { MyDetailsComponent } from './home/my-details/my-details.component';
import { LandingComponent } from './home/landing/landing.component';
import { RequestsComponent } from './home/leaves/requests/requests.component';
import { AddComponent } from './home/leaves/add/add.component';
import { RestLeavesComponent  } from './home/leaves/rest-leaves/rest-leaves.component';
import { AdminComponent } from "./home/admin/admin.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import { EditComponent } from './home/leaves/edit/edit.component';
import {AddUserComponent} from "./home/admin/add-user/add-user.component";
import {EditUserComponent} from "./home/admin/edit-user/edit-user.component";
import {AllEmployeesComponent} from "./home/hr/all-employees/all-employees.component";
import {AddEmployeeComponent} from "./home/hr/add-employee/add-employee.component";

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', redirectTo: 'home/landing', pathMatch: 'full'},
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: 'home', component: HomeComponent,
    children:[
      {path:'hr',redirectTo:'hr/all-employees',pathMatch: 'full'},
      {path:'hr',children:[
          {path:'all-employees',component: AllEmployeesComponent},
          {path:'add-employee',component: AddEmployeeComponent}
        ]},
      { path: 'MyDetails', component: MyDetailsComponent },
      { path: 'landing', component: LandingComponent },
      { path: 'admin', component: AdminComponent },
      { path: 'admin' ,children:[
          {path:'add-user', component: AddUserComponent},
          {path:'edit-user', component: EditUserComponent}
        ]},
      { path: 'leaves', redirectTo: 'leaves/requests', pathMatch: 'full'},
      { path: 'leaves', children:[
          {path: 'requests', component: RequestsComponent},
          {path: 'edit', component: EditComponent},
          {path: 'add', component: AddComponent},
          {path: 'restLeaves', component: RestLeavesComponent  }
      ]},

          {path: 'add', component: AddComponent}
      ]},
  {path: '**', component: PageNotFoundComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
