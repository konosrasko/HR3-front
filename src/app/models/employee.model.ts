export class Employee {

     employeeId?: number
     firstName?: string
     lastName?: string
     email?: string
     mobileNumber?: string
     address?: string
     hireDate?: string
     enabled?: boolean
     supervisorId?: number

    constructor(){
        this.employeeId = 1
        this.firstName = ""
        this.lastName = ""
        this.email = ""
        this.mobileNumber = ""
        this.address = ""
        this.hireDate = ""
        this.enabled = true
        this.supervisorId = 0
    }
}
