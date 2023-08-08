export class EmployeeUser {
  userId: number;
  username: string;
  password: string;
  role: string;
  firstName: string;
  lastName: string;
  enabled: boolean;
  supervisor: boolean;

    constructor(userId: number, username: string, password: string, role: string, firstName: string, lastName: string, enabled: boolean, supervisor: boolean) {
      this.userId = userId;
      this.username = username;
      this.password = password;
      this.role = role;
      this.firstName = firstName;
      this.lastName = lastName;
      this.enabled = enabled;
      this.supervisor = supervisor;
    }
}
