export class calendar {
    firstName?: string;
    lastName?: string
    title: string;
    start: string;
    end?: string;
    status: string;


    constructor(firstName:string,lastName:string,title:string,start:string,end:string,status:string) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.title = title;
        this.start = start;
        this.end = end
        this.status = status;
    }
}
