import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChemicalDialogComponent } from './chemical-dialog.component';

describe('ChemicalDialogComponent', () => {
  let component: ChemicalDialogComponent;
  let fixture: ComponentFixture<ChemicalDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChemicalDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChemicalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
