import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHSNCodeMasterComponent } from './add-hsn-code-master.component';

describe('AddHSNCodeMasterComponent', () => {
  let component: AddHSNCodeMasterComponent;
  let fixture: ComponentFixture<AddHSNCodeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddHSNCodeMasterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddHSNCodeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
