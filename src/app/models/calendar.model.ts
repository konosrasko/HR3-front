export class calendar {
    title: string;
    start: string;
    end?: string;
    status: string;


    constructor(title:string,start:string,end:string,status:string) {
        this.title = title;
        this.start = start;
        this.end = end
        this.status = status;
    }
}
