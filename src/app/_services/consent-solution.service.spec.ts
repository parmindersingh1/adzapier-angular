import { TestBed } from '@angular/core/testing';

import { ConsentSolutionService } from './consent-solution.service';

describe('ConsentSolutionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConsentSolutionService = TestBed.get(ConsentSolutionService);
    expect(service).toBeTruthy();
  });
});
