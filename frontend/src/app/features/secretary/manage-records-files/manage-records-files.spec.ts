import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRecordsFiles } from './manage-records-files';

describe('ManageRecordsFiles', () => {
  let component: ManageRecordsFiles;
  let fixture: ComponentFixture<ManageRecordsFiles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageRecordsFiles],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageRecordsFiles);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
