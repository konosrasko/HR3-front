export class User {
    id: number;
    username: string;
    password: string;
    isEnabled: boolean;
    employeeId: number;
    role: string;
    supervisor: boolean;

	constructor(id:number, username: string, password: string, isEnabled: boolean, employeeId: number, role: string, supervisor: boolean) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.isEnabled = isEnabled;
        this.employeeId = employeeId;
        this.role = role;
        this.supervisor = supervisor;
	}


  }
