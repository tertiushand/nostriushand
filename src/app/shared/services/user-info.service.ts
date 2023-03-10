import { Injectable } from '@angular/core';
import { StorageHelperService } from './storage-helper.service';
import { SystemUserInfo } from './system.class';
import { Nos2x } from './nostr/nostr.interface';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  constructor(
    private storage: StorageHelperService
  ) { }

  public setNostrPubKey() {
    let nos2x = window as Window as Nos2x;
    nos2x.nostr.getPublicKey().then((pubkey: string) => {
      this.storage.setUserInfo(new SystemUserInfo({pubkey: pubkey}));
    });
    this.storage.setUserInfo(new SystemUserInfo({pubkey: nos2x.nostr.getPublicKey()}));
  }
}
