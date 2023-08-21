export class Supervisors{
  employeeId?: number;
  lastName?: string;
  firstName?: string;
  constructor(lastName: string, id: number, firstName: string) {
    this.employeeId = id;
    this.lastName = lastName;
    this.firstName = firstName;
  }

}
