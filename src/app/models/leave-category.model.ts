export class LeaveCategory{
  id?: number;
  title?: string;
  active?: boolean;

  constructor(id: number, title: string, active: boolean) {
    this.id = id;
    this.title = title;
    this.active = active;
  }
}
