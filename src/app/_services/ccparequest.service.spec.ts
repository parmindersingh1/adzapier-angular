import { TestBed } from '@angular/core/testing';

import { CcparequestService } from './ccparequest.service';

describe('CcparequestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CcparequestService = TestBed.get(CcparequestService);
    expect(service).toBeTruthy();
  });
});
