export class User {
  id?: number;
  username?: string;
  password?: string;
  employeeId?: number;
  role?: string;
  supervisor?: boolean;
  enable?: boolean;
  logged?:boolean

	constructor(id:number, username: string, password: string, enable: boolean, employeeId: number, role: string, supervisor: boolean) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.employeeId = employeeId;
    this.role = role;
    this.supervisor = supervisor;
    this.enable = enable;

	}


}
