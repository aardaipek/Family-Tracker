import { TestBed } from '@angular/core/testing';

import { DashUserService } from './dash-user.service';

describe('DashUserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DashUserService = TestBed.get(DashUserService);
    expect(service).toBeTruthy();
  });
});
