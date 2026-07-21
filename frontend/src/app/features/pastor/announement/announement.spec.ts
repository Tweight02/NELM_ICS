import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Announement } from './announement';

describe('Announement', () => {
  let component: Announement;
  let fixture: ComponentFixture<Announement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Announement],
    }).compileComponents();

    fixture = TestBed.createComponent(Announement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
