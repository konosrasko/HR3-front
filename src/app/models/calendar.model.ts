export class calendar {
    title: string;
    start: string; // Date in ISO 8601 format
    end?: string; // Date in ISO 8601 format


    constructor(title:string,start:string,end:string) {
        this.title = title;
        this.start = start;
        this.end = end
    }
}
