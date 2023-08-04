export class employeeUser{
  userId: number;
  username: string;
  password: string;
  role: string;
  firstName: string;
  lastName: string;
  enabled: boolean;

    constructor(userId:number, username:string, password:string, role:string, firstName:string, lastName:string, enabled:boolean) {
      this.userId = userId;
      this.username=username;
      this.password=password;
      this.role=role;
      this.firstName=firstName;
      this.lastName=lastName;
      this.enabled=enabled;
    }

}
