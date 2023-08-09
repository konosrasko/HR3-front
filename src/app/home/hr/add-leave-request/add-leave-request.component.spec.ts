import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLeaveRequestComponent } from './add-leave-request.component';

describe('AddLeaveRequestComponent', () => {
  let component: AddLeaveRequestComponent;
  let fixture: ComponentFixture<AddLeaveRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddLeaveRequestComponent]
    });
    fixture = TestBed.createComponent(AddLeaveRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
