import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule} from '@angular/material/table';
import { AddComponent } from './add/add.component';
import { RequestsComponent } from './requests/requests.component';
import { MatSortModule } from '@angular/material/sort';
// import { RestLeavesModule } from './rest-leaves/rest-leaves.module';
import { FormsModule } from '@angular/forms';
import { RestLeavesComponent } from './rest-leaves/rest-leaves.component'; // Correct the import statement for RestLeavesComponent

@NgModule({
  declarations: [
    RequestsComponent,
    AddComponent,
    RestLeavesComponent

    ],
  imports: [
    // RestLeavesModule,
    CommonModule,
    MatTableModule,
    MatSortModule
  ]
})
export class LeavesModule { }
