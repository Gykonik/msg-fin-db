import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetPlanningComponent } from './budget-planning.component';

describe('BudgetOverviewComponentComponent', () => {
  let component: BudgetPlanningComponent;
  let fixture: ComponentFixture<BudgetPlanningComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BudgetPlanningComponent]
    });
    fixture = TestBed.createComponent(BudgetPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
