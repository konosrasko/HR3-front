import { Injectable } from '@angular/core';
import { TokenController } from "./token_controller";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { LeaveCategory } from "../models/leave-category.model";

@Injectable({providedIn: 'root'})
export class LeaveCategoryService extends TokenController{

  constructor(private http:HttpClient, router: Router) {
    super(router)
  }

  getAllLeaveCategories() {
    const headers = this.createHeadersWithToken();
    return this.http.get<LeaveCategory[]>('url/api/leavecategory', {headers, responseType: "text" as 'json'});
  }

}
