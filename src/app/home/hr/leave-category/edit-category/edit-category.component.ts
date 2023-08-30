import {Component, OnInit} from '@angular/core';
import {LeaveCategory} from "../../../../models/leave-category.model";
import {ActivatedRoute, Router} from "@angular/router";
import {NgToastService} from "ng-angular-popup";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LeaveCategoryService} from "../../../../services/leave-category.service";

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss']
})
export class EditCategoryComponent implements OnInit{
  category?: LeaveCategory;
  editCategoryFormGroup: FormGroup
  selectedCategory?: number
  isLoaded = false;
  isEdited = false;
  status?: boolean;

  constructor(private router: Router, private route:ActivatedRoute, private toast: NgToastService, private categoryService: LeaveCategoryService) {
    this.route.queryParams.subscribe(params=>{
      this.selectedCategory = params["id"];
    });
    this.editCategoryFormGroup = new FormGroup({
      titleFormControl: new FormControl('', [Validators.required]),
      activeFormControl: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
      this.categoryService.getLeaveCategory(this.selectedCategory).subscribe({
        next: data => this.loadCategory(data),
        error: error => {
          this.toast.error({detail: 'Αποτυχία!', summary: 'Δεν έχεις δικαιώματα HR ή υπήρξε πρόβλημα στην επικοινωνία με τον server!', position: "topRight", duration: 3000});
          this.router?.navigateByUrl('/home/hr/leave-categories');
        }
      })
  }

  loadCategory(data: any){
    this.category = JSON.parse(data);
    this.editCategoryFormGroup.controls['titleFormControl'].setValue('' || this.category?.title);
    this.editCategoryFormGroup.controls['activeFormControl'].setValue('' || this.category?.active);
    this.isLoaded = true;
    this.status = this.category?.active;
  }

  onEdited(){
    this.isEdited = true;
  }

  getTitleError(){
    if (this.editCategoryFormGroup.get('titleFormControl')?.hasError('required')) {
      return 'Πρέπει να εισάγεις τίτλο κατηγορίας';
    } else {
      return ''
    }
  }

  saveEditedCategory(){
    let id = this.category!.id || 0
    let editedCategory = new LeaveCategory(id, this.editCategoryFormGroup.get('titleFormControl')?.value, this.editCategoryFormGroup.get('activeFormControl')?.value);

      this.categoryService.editLeaveCategory(editedCategory).subscribe({
        next: data => {
          this.toast.success({detail: 'Επιτυχής Αποθήκευση!', summary: 'Η επεξεργασία της κατηγορίας άδειας έγινε με επιτυχία!', position: "topRight", duration: 5000});
          this.navigateTo();
        },
        error: err => {
          this.toast.error({detail: 'Αποτυχία!', summary: err.error, position: "topRight", duration: 5000});
          this.editCategoryFormGroup.get('titleFormControl')!.setValue('');
        }
      });

  }

  navigateTo(){
    this.router?.navigateByUrl('/home/hr/leave-categories');
  }

}
