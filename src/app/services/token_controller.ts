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

        if (token)
            return token;
        else {
            alert("Your session has expired");
            this.router.navigate(['/login'])
            return ''
        }
    }

}
