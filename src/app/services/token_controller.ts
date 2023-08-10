import { HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";

export class TokenController {

    constructor(private router: Router) { }

    createHeadersWithToken(): HttpHeaders {
        const token = this.getToken();
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        });
        return headers
    }


    getToken(): string {
        const token = localStorage.getItem('token');

        if (token){
            if (this.tokenIsValid(token)){
                return token;
            }
            else {
                this.router.navigate(['/login'], {queryParams: {error: "Η συνεδρία σας έληξε, παρακαλώ ξανασυνδεθείτε."}})
                return ''
            }
        }
        this.router.navigate(['/login'], {queryParams: {error: "Παρακαλώ συνδεθείτε."}})
        return ''
    }


    tokenIsValid(token: string):boolean {
        //TO-DO
        return true
    }

    getRouter():Router{
        return this.router
    }
    

}
