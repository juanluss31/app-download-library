import { TestBed } from '@angular/core/testing';

import { Hmacsha1Service } from './hmacsha1.service';

describe('Hmacsha1Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Hmacsha1Service = TestBed.get(Hmacsha1Service);
    expect(service).toBeTruthy();
  });
});
