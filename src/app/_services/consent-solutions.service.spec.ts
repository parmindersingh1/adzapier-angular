import { TestBed } from '@angular/core/testing';

import { ConsentSolutionsService } from './consent-solutions.service';

describe('ConsentSolutionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConsentSolutionsService = TestBed.get(ConsentSolutionsService);
    expect(service).toBeTruthy();
  });
});
