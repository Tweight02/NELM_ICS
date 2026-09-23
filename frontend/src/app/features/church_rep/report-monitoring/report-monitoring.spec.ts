import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportMonitoring } from './report-monitoring';

describe('ReportMonitoring', () => {
  let component: ReportMonitoring;
  let fixture: ComponentFixture<ReportMonitoring>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportMonitoring],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportMonitoring);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
