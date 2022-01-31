import { TestBed } from '@angular/core/testing';

import { LicenseguardService } from './licenseguard.service';

describe('LicenseguardService', () => {
  let service: LicenseguardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LicenseguardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
