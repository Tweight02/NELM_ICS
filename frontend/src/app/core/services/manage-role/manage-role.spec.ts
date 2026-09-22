import { TestBed } from '@angular/core/testing';

import { ManageRole } from './manage-role';

describe('ManageRole', () => {
  let service: ManageRole;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageRole);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
