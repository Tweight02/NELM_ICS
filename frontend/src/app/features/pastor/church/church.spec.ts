import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Church } from './church';

describe('Church', () => {
  let component: Church;
  let fixture: ComponentFixture<Church>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Church],
    }).compileComponents();

    fixture = TestBed.createComponent(Church);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
