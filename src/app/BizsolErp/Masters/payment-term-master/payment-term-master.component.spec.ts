import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTermMasterComponent } from './payment-term-master.component';

describe('PaymentTermMasterComponent', () => {
  let component: PaymentTermMasterComponent;
  let fixture: ComponentFixture<PaymentTermMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentTermMasterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaymentTermMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
