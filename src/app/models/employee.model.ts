export class Employee {

   employeeId?: number
   firstName?: string
   lastName?: string
   email?: string
   mobileNumber?: string
   address?: string
   hireDate?: string | null
   enabled?: boolean
   supervisorId?: number
   supervisorLastName?:string
   supervisorFirstName?:string

    constructor( firstName: string, lastName:string, email:string, mobileNumber:string,address:string, hireDate:string , isEnabled:boolean,supervisorId:number, supervisorLastName: string, supervisorFirstName: string) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.mobileNumber = mobileNumber;
        this.address = address;
        this.hireDate = hireDate;
        this.enabled= isEnabled;
        this.supervisorId = supervisorId;
        this.supervisorLastName = supervisorLastName;
        this.supervisorFirstName = supervisorFirstName;
     }
}
