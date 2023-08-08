import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HRComponent } from './hr.component';

describe('HRComponent', () => {
  let component: HRComponent;
  let fixture: ComponentFixture<HRComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HRComponent]
    });
    fixture = TestBed.createComponent(HRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
