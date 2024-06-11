import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateTableComponent } from './state-table.component';

describe('StateTableComponent', () => {
  let component: StateTableComponent;
  let fixture: ComponentFixture<StateTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StateTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StateTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
