import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HSNCodeComponentComponent } from './hsn-code-component.component';

describe('HSNCodeComponentComponent', () => {
  let component: HSNCodeComponentComponent;
  let fixture: ComponentFixture<HSNCodeComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HSNCodeComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HSNCodeComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
