import { TestBed } from '@angular/core/testing';

import { PdfmergeService } from './pdfmerge.service';

describe('PdfmergeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PdfmergeService = TestBed.get(PdfmergeService);
    expect(service).toBeTruthy();
  });
});
