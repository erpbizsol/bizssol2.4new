import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyRoutePlanComponent } from './verify-route-plan.component';

describe('VerifyRoutePlanComponent', () => {
  let component: VerifyRoutePlanComponent;
  let fixture: ComponentFixture<VerifyRoutePlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyRoutePlanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerifyRoutePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
