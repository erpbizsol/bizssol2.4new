import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFollowUpComponent } from './edit-follow-up.component';

describe('EditFollowUpComponent', () => {
  let component: EditFollowUpComponent;
  let fixture: ComponentFixture<EditFollowUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditFollowUpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditFollowUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
