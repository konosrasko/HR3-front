import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LeaveCategoryComponent} from './leave-category.component';

describe('LeaveCategoryComponent', () => {
  let component: LeaveCategoryComponent;
  let fixture: ComponentFixture<LeaveCategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeaveCategoryComponent]
    });
    fixture = TestBed.createComponent(LeaveCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
