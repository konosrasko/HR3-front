import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestLeavesComponent } from './rest-leaves.component';

describe('RestLeavesComponent', () => {
  let component: RestLeavesComponent;
  let fixture: ComponentFixture<RestLeavesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RestLeavesComponent]
    });
    fixture = TestBed.createComponent(RestLeavesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
