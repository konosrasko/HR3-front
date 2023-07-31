export class Employee {

     id: number
     firstName: string
     lastName: string
     email: string
     mobileNumber: number
     address: string
     hireDate?: Date
     enabled?: boolean
     supervisorId?: number

    constructor(){
        this.id = 1
        this.firstName = ""
        this.lastName = ""
        this.email = ""
        this.mobileNumber = 0
        this.address = ""
    }
}
