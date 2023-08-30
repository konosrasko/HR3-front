import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';
import {MyDetailsComponent} from './home/my-details/my-details.component';
import {LandingComponent} from './home/landing/landing.component';
import {RequestsComponent} from './home/leaves/requests/requests.component';
import {AddComponent} from './home/leaves/add/add.component';
import {RestLeavesComponent} from './home/leaves/rest-leaves/rest-leaves.component';
import {AdminComponent} from "./home/admin/admin.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {EditComponent} from './home/leaves/edit/edit.component';
import {AddUserComponent} from "./home/admin/add-user/add-user.component";
import {EditUserComponent} from "./home/admin/edit-user/edit-user.component";
import {AllEmployeesComponent} from "./home/hr/all-employees/all-employees.component";
import {AddEmployeeComponent} from "./home/hr/add-employee/add-employee.component";
import {SubordinatesComponent} from "./home/subordinates/subordinates.component";
import {SubordinateRequestComponent} from './home/subordinates/requests/subordinate-requests.component';
import {SubordinateListComponent} from './home/subordinates/subordinate-list/subordinate-list.component';
import {LeaveCategoryComponent} from "./home/hr/leave-category/leave-category.component";
import {AddCategoryComponent} from "./home/hr/leave-category/add-category/add-category.component";
import {EditCategoryComponent} from "./home/hr/leave-category/edit-category/edit-category.component";
import {
  SubordinateProfileComponent
} from "./home/subordinates/subordinate-list/subordinate-profile/subordinate-profile.component";
import {EditEmployeeComponent} from "./home/hr/all-employees/edit-employee/edit-employee.component";
import {CalendarComponent} from "./home/calendar/calendar.component";

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', redirectTo: 'home/landing', pathMatch: 'full'},
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: 'home', component: HomeComponent,
    children:[
      {path:'hr',redirectTo:'hr/all-employees',pathMatch: 'full'},
      {path:'hr',children:[
          {path:'all-employees',component: AllEmployeesComponent},
          {path:'add-employee',component: AddEmployeeComponent},
          {path:'leave-categories',component: LeaveCategoryComponent},
          {path:'edit-employee',component: EditEmployeeComponent},
          {path:'leave-categories', children:[
              {path: 'add-category', component: AddCategoryComponent},
              {path: 'edit-category', component: EditCategoryComponent}
            ]}
        ]},
      { path: 'calendar',component: CalendarComponent},
      { path: 'MyDetails', component: MyDetailsComponent },
      { path: 'landing', component: LandingComponent },
      { path: 'subordinates', component: SubordinatesComponent},
      { path: 'subordinates', children:[
        {path:'list', component: SubordinateListComponent},
        {path:'subordinate-profile', component: SubordinateProfileComponent},
        {path:'requests', component: SubordinateRequestComponent}
      ]},
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
