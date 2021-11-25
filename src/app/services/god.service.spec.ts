import { TestBed } from '@angular/core/testing';

import { GodService } from './god.service';

describe('GodService', () => {
  let service: GodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
