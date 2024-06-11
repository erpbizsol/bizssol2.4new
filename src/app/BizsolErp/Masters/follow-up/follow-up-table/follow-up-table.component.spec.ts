import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowUpTableComponent } from './follow-up-table.component';

describe('FollowUpTableComponent', () => {
  let component: FollowUpTableComponent;
  let fixture: ComponentFixture<FollowUpTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FollowUpTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FollowUpTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
