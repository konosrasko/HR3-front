import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllEmployeesComponent } from './all-employees.component';



describe('AllEmployeesComponent', () => {
  let component: AllEmployeesComponent;
  let fixture: ComponentFixture<AllEmployeesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllEmployeesComponent]
    });
    fixture = TestBed.createComponent(AllEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
