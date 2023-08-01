export class employeeUser{
  username: string;
  password: string;
  role: string;
  firstName: string;
  lastName: string;
  enabled: boolean;

    constructor(username:string, password:string, role:string, firstName:string, lastName:string, enabled:boolean) {
      this.username=username;
      this.password=password;
      this.role=role;
      this.firstName=firstName;
      this.lastName=lastName;
      this.enabled=enabled;
    }

}
