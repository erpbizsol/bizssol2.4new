import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TankDailyStockComponent } from './tank-daily-stock.component';

describe('TankDailyStockComponent', () => {
  let component: TankDailyStockComponent;
  let fixture: ComponentFixture<TankDailyStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TankDailyStockComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TankDailyStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
