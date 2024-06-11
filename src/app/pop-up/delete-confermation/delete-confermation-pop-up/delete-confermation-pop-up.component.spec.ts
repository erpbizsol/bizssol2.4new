import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteConfermationPopUpComponent } from './delete-confermation-pop-up.component';

describe('DeleteConfermationPopUpComponent', () => {
  let component: DeleteConfermationPopUpComponent;
  let fixture: ComponentFixture<DeleteConfermationPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteConfermationPopUpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteConfermationPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
