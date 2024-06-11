import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteDailogBoxComponent } from './route-dailog-box.component';

describe('RouteDailogBoxComponent', () => {
  let component: RouteDailogBoxComponent;
  let fixture: ComponentFixture<RouteDailogBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouteDailogBoxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RouteDailogBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
