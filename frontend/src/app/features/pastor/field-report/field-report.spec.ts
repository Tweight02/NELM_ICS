import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldReport } from './field-report';

describe('FieldReport', () => {
  let component: FieldReport;
  let fixture: ComponentFixture<FieldReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldReport],
    }).compileComponents();

    fixture = TestBed.createComponent(FieldReport);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
