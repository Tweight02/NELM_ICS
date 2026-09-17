import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stewarsdship } from './stewarsdship';

describe('Stewarsdship', () => {
  let component: Stewarsdship;
  let fixture: ComponentFixture<Stewarsdship>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Stewarsdship],
    }).compileComponents();

    fixture = TestBed.createComponent(Stewarsdship);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
