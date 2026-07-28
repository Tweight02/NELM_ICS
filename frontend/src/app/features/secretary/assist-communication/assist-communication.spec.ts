import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistCommunication } from './assist-communication';

describe('AssistCommunication', () => {
  let component: AssistCommunication;
  let fixture: ComponentFixture<AssistCommunication>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssistCommunication],
    }).compileComponents();

    fixture = TestBed.createComponent(AssistCommunication);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
