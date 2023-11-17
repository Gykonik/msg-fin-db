import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetOverviewComponent } from './budget-overview.component';

describe('BudgetOverviewComponentComponent', () => {
  let component: BudgetOverviewComponent;
  let fixture: ComponentFixture<BudgetOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BudgetOverviewComponent]
    });
    fixture = TestBed.createComponent(BudgetOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
