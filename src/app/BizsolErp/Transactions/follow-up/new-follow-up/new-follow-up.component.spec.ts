import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFollowUpComponent } from './new-follow-up.component';

describe('NewFollowUpComponent', () => {
  let component: NewFollowUpComponent;
  let fixture: ComponentFixture<NewFollowUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewFollowUpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewFollowUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
