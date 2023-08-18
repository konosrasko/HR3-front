import {Injectable} from '@angular/core';
import {TokenController} from "./token_controller";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {LeaveCategory} from "../models/leave-category.model";

@Injectable({providedIn: 'root'})
export class LeaveCategoryService extends TokenController{

  constructor(private http:HttpClient, router: Router) {
    super(router)
  }

  getAllLeaveCategories() {
    const headers = this.createHeadersWithToken();
    return this.http.get<LeaveCategory[]>('url/api/leavecategory', {headers, responseType: "text" as 'json'});
  }

  getActiveLeaveCategories(){
    const headers = this.createHeadersWithToken();
    return this.http.get<LeaveCategory[]>('url/api/leavecategory/active', {headers, responseType: "text" as 'json'})
  }

  getLeaveCategory(id?: number){
    const headers = this.createHeadersWithToken();
    return this.http.get<LeaveCategory>('url/api/leavecategory/' + id, {headers, responseType: "text" as 'json'})
  }

  createLeaveCategory(newCategory: LeaveCategory){
    const headers = this.createHeadersWithToken();
    return this.http.post<LeaveCategory>('url/api/leavecategory', newCategory, {headers, responseType: "text" as 'json'})
  }

  editLeaveCategory(editedCategory: LeaveCategory){
    const headers = this.createHeadersWithToken();
    return this.http.put<LeaveCategory>('url/api/leavecategory', editedCategory, {headers, responseType: "text" as 'json'})
  }

}
