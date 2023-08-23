export class User {
  id?: number;
  username?: string;
  password?: string;
  employeeId?: number;
  role?: string;
  supervisor?: boolean;
  enable?: boolean;
  isPassTemp: boolean = false;

	constructor(id:number, username: string, password: string, enable: boolean, employeeId: number, role: string, supervisor: boolean, isPassTemp?: boolean) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.employeeId = employeeId;
    this.role = role;
    this.supervisor = supervisor;
    this.enable = enable;
    if (isPassTemp)
      this.isPassTemp = isPassTemp;

	}
}
