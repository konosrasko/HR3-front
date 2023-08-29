import {HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";

export class TokenController{

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
                this.router?.navigate(['/login'], {queryParams: {error: "Η συνεδρία σας έληξε, παρακαλώ ξανασυνδεθείτε.", tokenExpired: true}})
                return ''
            }
        }
        this.router?.navigate(['/login'], {queryParams: {error: "Παρακαλώ συνδεθείτε."}})
        return ''
    }

    tokenIsValid(token: string):boolean {
        //TO-DO
        const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
        const currentTime = (new Date).getTime()/ (1000)
        return expiry > currentTime
    }

    getRouter():Router{
        return this.router
    }

}
function jwtDecode(token: any): any {
    throw new Error("Function not implemented.");
}
