import { TestBed } from '@angular/core/testing';

import { SellersService } from './sellers.service';

describe('SellersService', () => {
  let service: SellersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SellersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
