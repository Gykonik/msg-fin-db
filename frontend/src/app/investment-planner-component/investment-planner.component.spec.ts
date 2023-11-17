import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentPlannerComponent } from './investment-planner.component';

describe('InvestmentPlannerComponentComponent', () => {
  let component: InvestmentPlannerComponent;
  let fixture: ComponentFixture<InvestmentPlannerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InvestmentPlannerComponent]
    });
    fixture = TestBed.createComponent(InvestmentPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
