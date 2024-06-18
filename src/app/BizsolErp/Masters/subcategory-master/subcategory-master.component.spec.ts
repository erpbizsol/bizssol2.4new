import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcategoryMasterComponent } from './subcategory-master.component';

describe('SubcategoryMasterComponent', () => {
  let component: SubcategoryMasterComponent;
  let fixture: ComponentFixture<SubcategoryMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubcategoryMasterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubcategoryMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
