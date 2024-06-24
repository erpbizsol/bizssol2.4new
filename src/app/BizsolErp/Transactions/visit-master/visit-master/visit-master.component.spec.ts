import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitMasterComponent } from './visit-master.component';

describe('VisitMasterComponent', () => {
  let component: VisitMasterComponent;
  let fixture: ComponentFixture<VisitMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitMasterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VisitMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
