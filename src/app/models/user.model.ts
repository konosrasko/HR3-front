export class User {
    id: number;
    username: string;
    password: string;
    isEnabled: boolean;
    employeeId: number;
    role: string;

	constructor(id:number, username: string, password: string, isEnabled: boolean, employeeId: number, role: string) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.isEnabled = isEnabled;
        this.employeeId = employeeId;
        this.role = role;
	}


  }
