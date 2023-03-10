import { TestBed } from '@angular/core/testing';

import { NostrMsgHelperService } from './nostr-msg-helper.service';

describe('NostrMsgHelperService', () => {
  let service: NostrMsgHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NostrMsgHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
