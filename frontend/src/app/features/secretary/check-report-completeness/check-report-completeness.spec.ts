import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckReportCompleteness } from './check-report-completeness';

describe('CheckReportCompleteness', () => {
  let component: CheckReportCompleteness;
  let fixture: ComponentFixture<CheckReportCompleteness>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckReportCompleteness],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckReportCompleteness);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
