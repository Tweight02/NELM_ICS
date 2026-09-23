import { TestBed } from '@angular/core/testing';

import { Stewardship } from './stewardship';

describe('Stewardship', () => {
  let service: Stewardship;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Stewardship);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
