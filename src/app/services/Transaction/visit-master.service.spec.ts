import { TestBed } from '@angular/core/testing';

import { VisitMasterService } from './visit-master.service';

describe('VisitMasterService', () => {
  let service: VisitMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VisitMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
