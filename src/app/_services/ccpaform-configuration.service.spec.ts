import { TestBed } from '@angular/core/testing';

import { CCPAFormConfigurationService } from './ccpaform-configuration.service';

describe('CCPAFormConfigurationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CCPAFormConfigurationService = TestBed.get(CCPAFormConfigurationService);
    expect(service).toBeTruthy();
  });
});
