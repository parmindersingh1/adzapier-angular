import { TestBed } from '@angular/core/testing';

import { CcpadataService } from './ccpadata.service';

describe('CcpadataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CcpadataService = TestBed.get(CcpadataService);
    expect(service).toBeTruthy();
  });
});
