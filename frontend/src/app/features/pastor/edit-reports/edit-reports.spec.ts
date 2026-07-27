import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditReports } from './edit-reports';

describe('EditReports', () => {
  let component: EditReports;
  let fixture: ComponentFixture<EditReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditReports],
    }).compileComponents();

    fixture = TestBed.createComponent(EditReports);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
