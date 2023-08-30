import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {NgToastService} from "ng-angular-popup";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LeaveCategory} from "../../../../models/leave-category.model";
import {LeaveCategoryService} from "../../../../services/leave-category.service";

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit{

  allCategories?: LeaveCategory[];
  newCategoryFormGroup: FormGroup;

  constructor(private router: Router, private toast: NgToastService, private categoryService: LeaveCategoryService) {
    this.newCategoryFormGroup = new FormGroup({
      titleFormControl: new FormControl('', [Validators.required])
    })
  }

  ngOnInit() {
      this.categoryService.getAllLeaveCategories().subscribe({
        next: data => this.loadCategories(data),
        error: err => {
          this.toast.error({detail: 'Αποτυχία!', summary: 'Δεν έχεις δικαιώματα HR ή υπήρξε πρόβλημα στην επικοινωνία με τον server!', position: "topRight", duration: 4000});
          this.router?.navigateByUrl('home/landing');
        }
      })
  }

  loadCategories(data: any){
    this.allCategories = JSON.parse(data);
  }

  getTitleError() {
    if (this.newCategoryFormGroup.get('titleFormControl')?.hasError('required')) {
      return 'Πρέπει να εισάγεις τίτλο κατηγορίας!';
    }else {
      return ''
    }
  }

  saveCategory(){
    let newCategory = new LeaveCategory(0, this.newCategoryFormGroup.get('titleFormControl')?.value, true);
      this.categoryService.createLeaveCategory(newCategory).subscribe({
        next: data => {
          this.toast.success({detail: 'Επιτυχής Αποθήκευση!', summary: 'Η νέα κατηγορία άδειας δημιουργήθηκε με επιτυχία!', position: "topRight", duration: 5000});
          this.router?.navigateByUrl('/home/hr/leave-categories');
        },
        error: err => {
          this.toast.error({detail: 'Αποτυχία!', summary: err.error, position: "topRight", duration: 5000});
          this.newCategoryFormGroup.get('titleFormControl')?.setValue('');
        }
      })
  }

  navigateTo(){
    this.router?.navigateByUrl('home/hr/leave-categories');
  }

}
