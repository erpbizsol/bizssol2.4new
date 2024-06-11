import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TankConfigurationComponent } from './tank-configuration.component';

describe('TankConfigurationComponent', () => {
  let component: TankConfigurationComponent;
  let fixture: ComponentFixture<TankConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TankConfigurationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TankConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
