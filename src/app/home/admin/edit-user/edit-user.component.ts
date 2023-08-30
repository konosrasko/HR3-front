import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {EmployeeUser} from "../../../models/employeeUser.model";
import {UserService} from "../../../services/user.service";
import {User} from "../../../models/user.model";
import {NgToastService} from "ng-angular-popup";

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})

export class EditUserComponent implements OnInit {
  employeeUser?: EmployeeUser;

  hide = true;
  selectedUserId?: number;
  isSupervisor?: string = '';
  isLoaded: boolean = false;
  oldPass: string = '';
  editUserFormGroup: FormGroup;
  isEdited = false;
  status?: boolean;

  constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private toast: NgToastService) {
    this.route.queryParams.subscribe(params => {
      this.selectedUserId = params["userId"];
    });
    this.editUserFormGroup = new FormGroup({
      usernameFormControl: new FormControl('', [Validators.required, Validators.pattern(/^([a-zA-Z]+|[\u10D0-\u10F0]+)$/)]),
      passwordFormControl: new FormControl(''),
      rolesFormControl: new FormControl('', [Validators.required]),
      isEnabledFormControl: new FormControl('', [Validators.required]),
      isSupervisorFormControl: new FormControl('', [Validators.required])
    })
  }

  ngOnInit() {
    if (this.selectedUserId)
      this.userService.getUserEmployeeDetails(this.selectedUserId).subscribe({
        next: data => this.loadEmployeeUserData(data),
        error: error => {
          this.toast.error({ detail: 'Αποτυχία!', summary: error.error, position: "topRight", duration: 3000 });
          this.router?.navigateByUrl('/home/admin');
        }
      });
  }

  loadEmployeeUserData(data: any) {
    let sv_value: string
    this.employeeUser = JSON.parse(data);

    if (this.employeeUser?.supervisor) { sv_value = '1' } else { sv_value = '2' }

    this.editUserFormGroup.controls['usernameFormControl'].setValue('' || this.employeeUser!.username);
    this.editUserFormGroup.controls['rolesFormControl'].setValue(this.employeeUser!.role.toLowerCase());
    this.editUserFormGroup.controls['isEnabledFormControl'].setValue(this.employeeUser?.enabled);
    this.editUserFormGroup.controls['isSupervisorFormControl'].setValue(sv_value);

    this.oldPass = this.employeeUser!.password;
    this.status = this.employeeUser!.enabled;
    this.isLoaded = true;
  }

  navigateTo() {
    this.router?.navigateByUrl('home/admin');
  }

  onEdited() {
    this.isEdited = true;
  }

  saveEditUser() {
    let editedUser: User = new User(this.employeeUser!.userId, this.editUserFormGroup.get('usernameFormControl')!.value, this.editUserFormGroup.get('passwordFormControl')!.value, this.editUserFormGroup.get('isEnabledFormControl')!.value, this.employeeUser!.employeeId, 'Admin', false);
    let isPassEdited = true;
    if (this.editUserFormGroup.get('rolesFormControl')?.value == 'employee') {
      editedUser.role = 'Employee';
    } else if (this.editUserFormGroup.get('rolesFormControl')?.value == 'hr') {
      editedUser.role = 'HR';
    } else if (this.editUserFormGroup.get('rolesFormControl')?.value == 'admin') {
      editedUser.role = 'Admin'
    }

    if (this.isSupervisor == '1') {
      editedUser.supervisor = true;
    } else if (this.isSupervisor == '2') {
      editedUser.supervisor = false;
    }

    if (this.editUserFormGroup.get('passwordFormControl')!.value == '') {
      editedUser.password = this.oldPass;
      isPassEdited = false
    }

    this.userService.editUserAccount(editedUser, isPassEdited, editedUser.id).subscribe({
      next: data => {
        this.toast.success({ detail: 'Επιτυχής Αποθήκευση!', summary: 'Η επεξεργασία του λογαριασμού έγινε με επιτυχία!', position: "topRight", duration: 5000 });
        this.navigateTo();
      },
      error: error => {
        this.toast.error({ detail: 'Αποτυχία!', summary: error.error, position: "topRight", duration: 5000 });
      }
    });
  }
}

