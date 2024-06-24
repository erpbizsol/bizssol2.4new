import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVisitMasterComponent } from './edit-visit-master.component';

describe('EditVisitMasterComponent', () => {
  let component: EditVisitMasterComponent;
  let fixture: ComponentFixture<EditVisitMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditVisitMasterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditVisitMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
