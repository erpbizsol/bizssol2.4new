import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowUpViewTableComponent } from './follow-up-view-table.component';

describe('FollowUpViewTableComponent', () => {
  let component: FollowUpViewTableComponent;
  let fixture: ComponentFixture<FollowUpViewTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FollowUpViewTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FollowUpViewTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
