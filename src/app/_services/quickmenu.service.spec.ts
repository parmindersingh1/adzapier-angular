import { TestBed } from '@angular/core/testing';

import { QuickmenuService } from './quickmenu.service';

describe('QuickmenuService', () => {
  let service: QuickmenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuickmenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
